import { serve } from "inngest/next";
import { Inngest } from "inngest";
import { createClient } from "@supabase/supabase-js";
import { dummyTranscript, dummySummary, dummyMom } from "@/lib/dummy";
import get from "lodash.get";
import { LANGUAGES } from "@/lib/constants";

export const inngest = new Inngest({ id: "meeting-assistant" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const generate = inngest.createFunction(
  {
    id: "generate",
  },
  {
    event: "ai/generate",
  },
  async ({ event, step }) => {
    const meeting = event.data.meeting;
    const session = event.data.session;

    await step.run("set-supabase-token", async () => {
      return await supabase.auth.setSession({
        access_token: session.access_token,
        refresh_token: session.refresh_token,
      });
    });

    const stepTranscribe = await step.run(
      "generate-transcription",
      async () => {
        const transcript = await fetch(
          process.env.API_URL + "/api/v1/transcribe",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "api-key": process.env.V1_API_KEY,
            },
            body: JSON.stringify({
              file_url: meeting.file_url,
              language: meeting.language,
            }),
          }
        ).then((res) => res.json());

        return await supabase
          .from("meetings")
          .update({
            transcript,
          })
          .eq("id", meeting.id)
          .select("transcript")
          .single();
      }
    );

    const stepSummary = await step.run("generate-summary", async () => {
      const transcript = get(stepTranscribe, "data.transcript.text", null);

      if (!transcript) {
        return { message: "Error fetching transcript", error: meeting };
      }

      const res = await fetch(process.env.API_URL + "/api/v1/summarize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "api-key": process.env.V1_API_KEY,
        },
        body: JSON.stringify({
          transcript,
          language: LANGUAGES[meeting.language],
        }),
      }).then((res) => res.json());

      return await supabase
        .from("meetings")
        .update({
          summary: res.summary,
          mom: res.mom,
        })
        .eq("id", meeting.id)
        .select("transcript, summary")
        .single();
    });

    await step.run("deduct-credits", async () => {
      const usedCredits = get(stepSummary, "data.transcript.duration", 0);
      const resBalance = await supabase
        .from("balance")
        .select("credits")
        .eq("user_id", meeting.user_id)
        .single();

      if (resBalance.error) {
        return { message: "Error fetching balance", error: meeting };
      }

      return await supabase
        .from("balance")
        .update({
          credits: resBalance.data.credits - Math.ceil(usedCredits),
        })
        .eq("user_id", meeting.user_id)
        .select("credits")
        .single();
    });

    return { event, body: "Done summarizing " + meeting.id };
  }
);

// Create an API that serves zero functions
export default serve({
  client: inngest,
  functions: [generate],
});
