import { Button } from "@/components/ui/button";
import { createSupabaseComponentClient } from "@/lib/supabase/component";
import { useEffect } from "react";

export default function Page() {
  const supabase = createSupabaseComponentClient();

  const checkUser = async () => {
    const { data } = await supabase.auth.getUser();

    if (data && data.user && data.user.email) {
      window.location.href = "/app";
    }
  };

  useEffect(() => {
    checkUser();
  }, []);

  const handleSignIn = () => {
    supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin + "/login",
      },
    });
  };

  return (
    <div className="flex justify-center items-center w-screen h-screen flex-col gap-8">
      <h1 className="text-5xl font-bold text-center">
        Sign in to <br />
        Meeting Assistant
      </h1>
      <Button
        size="lg"
        variant="outline"
        className="gap-2"
        onClick={handleSignIn}
      >
        <svg width="16" height="16" fill="none" viewBox="0 0 16 16">
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M8.12112 7.14231V9.20025H11.5931C11.4521 10.0836 10.5431 11.7877 8.12112 11.7877C6.03125 11.7877 4.3262 10.0912 4.3262 8.00022C4.3262 5.90951 6.03125 4.21296 8.12112 4.21296C9.30964 4.21296 10.1061 4.71012 10.5607 5.13841L12.2229 3.57031C11.1564 2.59105 9.77419 2 8.12202 2C4.73812 2 2 4.68355 2 8C2 11.3164 4.73812 14 8.12202 14C11.6544 14 14 11.5649 14 8.13798C14 7.74424 13.9571 7.44438 13.9042 7.14432L8.12202 7.14188L8.12112 7.14233V7.14231Z"
            fill="currentColor"
          ></path>
        </svg>
        Sign in with Google
      </Button>
    </div>
  );
}
