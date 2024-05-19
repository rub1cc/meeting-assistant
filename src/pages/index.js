import Image from "next/image";
import { Inter } from "next/font/google";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <main className="w-screen h-screen flex justify-center items-center">
      <div className="text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-6xl font-bold">Introducing Meeting Assistant</h1>
          <p>
            Never take meeting notes again. Get transcripts, automated summaries
            and action items.
          </p>
        </div>
        <Button size="lg" className="relative">
          <Link href="/login" className="absolute inset-0 opacity-0">
            Start for Free
          </Link>
          Start for Free
        </Button>
      </div>
    </main>
  );
}
