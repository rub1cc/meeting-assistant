import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { createSupabaseComponentClient } from "@/lib/supabase/component";
import { Icons } from "./icons";
import Link from "next/link";

export function GuestNav() {
  const supabase = createSupabaseComponentClient();

  const handleSignIn = () => {
    supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin + "/",
      },
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="relative h-8 w-8 rounded-full">
          <span>
            <Icons.menu className="w-4 h-4" />
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuItem className="relative gap-2" onClick={handleSignIn}>
          <Icons.google className="w-4 h-4" />
          Login with Google
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="relative gap-2">
          <Link href="/faq" className="absolute inset-0 opacity-0">
            Go to faq page
          </Link>
          <Icons.questionMarkCircle className="w-4 h-4" />
          FAQs
        </DropdownMenuItem>
        <DropdownMenuItem className="relative gap-2">
          <Link href="/pricing" className="absolute inset-0 opacity-0">
            Go to pricing page
          </Link>
          <Icons.dollar className="w-4 h-4" />
          Pricing
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
