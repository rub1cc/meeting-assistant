import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { createSupabaseComponentClient } from "@/lib/supabase/component";
import { Icons } from "./icons";

export function LoginDialog({ isOpen, onOpenChange }) {
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
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] text-center py-12">
        <div className="space-y-10">
          <div className="space-y-4">
            <p className="text-2xl font-bold">Sign in to Meeting Assistant</p>
            <p>Login is required to upload a meeting.</p>
          </div>
          <Button className="gap-2" onClick={handleSignIn}>
            <Icons.google className="w-4 h-4" />
            Sign in with Google
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
