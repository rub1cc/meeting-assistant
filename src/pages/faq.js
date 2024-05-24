import { Breadcrumbs } from "@/components/breadcrumbs";
import { GuestNav } from "@/components/guest-nav";
import { UserNav } from "@/components/user-nav";
import { useQuery } from "@tanstack/react-query";

const faqs = [
  {
    question: "What is Meeting Assistant?",
    answer:
      "Meeting Assistant is a tool that helps you to transcribe, summarize, and take notes for your meetings.",
  },
  {
    question: "How does Meeting Assistant work?",
    answer: `
    After you upload a recording of your meeting, Meeting Assistant works by analyzing the audio of your meeting and generating a transcript. <br/> <br/>

    It then summarizes the transcript and generates a meeting summary and minute of meeting.
    `,
  },
  {
    question: "How much does Meeting Assistant cost?",
    answer: `
    For now, Meeting Assistant is free to use. You will get 30 minutes of free transcription and summary per month.
    `,
  },
];

export default function Page() {
  return (
    <div>
      <div className="p-4 flex justify-between items-center">
        <Breadcrumbs
          paths={[
            {
              label: "Frequently Asked Questions",
            },
          ]}
        />
        <div className="flex gap-4 items-center">
          <UserNav />
        </div>
      </div>
      <main className="w-full max-w-[70ch] mx-auto mt-8 px-4 lg:px-0">
        <div className="text-center">
          <h1 className="pb-4 text-4xl font-bold">Frequently Asked Question</h1>
          <p className="text-neutral-500">
            Get answers to your questions about Meeting Assitant.
          </p>
        </div>
        <div className="mt-16 space-y-6">
          {faqs.map((faq, index) => (
            <div key={index} className="py-4">
              <h2 className="font-semibold text-2xl">{faq.question}</h2>
              <p
                className="mt-6 text-neutral-500"
                dangerouslySetInnerHTML={{ __html: faq.answer }}
              ></p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
