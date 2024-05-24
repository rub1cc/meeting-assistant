import createSupabaseApiClient from "@/lib/supabase/api";
import { inngest } from "../inngest";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const supabase = createSupabaseApiClient(req, res);
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const meeting = await supabase
    .from("meetings")
    .select("id, file_url, language, user_id")
    .eq("id", req.query.meeting_id)
    .single();

  if (!meeting.data || meeting.error) {
    return res.status(404).json({ message: "Meeting not found" });
  }

  inngest.send({
    name: "ai/generate",
    data: {
      meeting: meeting.data,
      session: {
        access_token: session.access_token,
        refresh_token: session.refresh_token,
      },
    },
  });

  return res.status(200).json({
    message: "Transcription started",
  });
}
