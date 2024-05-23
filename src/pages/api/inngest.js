import { serve } from "inngest/next";
import { Inngest } from "inngest";
import { createClient } from "@supabase/supabase-js";
import { dummyTranscript, dummySummary, dummyMom } from "@/lib/dummy";

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
      console.log("session", session);
      return await supabase.auth.setSession({
        access_token: session.access_token,
        refresh_token: session.refresh_token,
      });
    });

    await step.sleep("wait-a-moment", "5s");
    await step.run("generate-transcription", async () => {
      const transcript = await fetch(
        process.env.API_URL + "/api/v1/transcribe",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "api-key": process.env.V1_API_KEY,
          },
          body: JSON.stringify({
            file: meeting.file_url,
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
    });

    await step.sleep("wait-a-moment", "5s");
    await step.run("generate-summary", async () => {
      const res = await fetch(process.env.API_URL + "/api/v1/summarize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "api-key": process.env.V1_API_KEY,
        },
        body: JSON.stringify({
          transcript: meeting.transcript,
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

    return { event, body: "Transcribing " + meeting.id };
  }
);

// Create an API that serves zero functions
export default serve({
  client: inngest,
  functions: [generate],
});
