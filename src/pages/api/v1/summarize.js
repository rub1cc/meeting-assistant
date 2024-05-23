import { dummyMom, dummySummary, dummyTranscript } from "@/lib/dummy";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(404).json({ message: "Not found" });
  }

  return res.status(200).json({ summary: dummySummary, mom: dummyMom });
}
