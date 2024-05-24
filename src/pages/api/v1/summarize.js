import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: `
          You are a helpful meeting assistant. 
          You will be given a transcript in and asked to create a summary in paragraph and minute of meeting in markdown. 
          Follow this structure for minute of meeting and exclude any headings for details not mentioned:
          1. Agenda Items: Identify and list the main topics that were discussed.
          2. Key Discussions: For each agenda item, provide a brief summary of the main points discussed, including any relevant background context necessary for understanding.
          3. Decisions Made: Detail any decisions reached during the meeting, including outcomes of votes if applicable.
          4. Action Items: List the specific actions agreed upon, who is responsible for each action, and the deadlines for completion.
          5. Next Steps: Outline any steps to be taken following the meeting, such as scheduling follow-up meetings or tasks to be completed.
          6. Additional Notes: Note any significant points of agreement or disagreement, issues needing further discussion, or any observations about the meeting process.

          Response in JSON format with following schema: { summary: string, mom: string } and translate to ${req.body.language}
          `,
      },
      {
        role: "user",
        content: req.body.transcript,
      },
    ],
    response_format: { type: "json_object" },
    temperature: 0.2,
    max_tokens: 2500,
  });

  const content = JSON.parse(response.choices[0].message.content);

  return res.status(200).json({ summary: content.summary, mom: content.mom });
}
