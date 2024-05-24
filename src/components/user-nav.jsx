import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { createSupabaseComponentClient } from "@/lib/supabase/component";
import {
  getInitials,
  secondsToCreditsLong,
  secondsToCreditsShort,
} from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import get from "lodash.get";
import Link from "next/link";
import { Icons } from "./icons";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { UploadButton } from "./upload-button";
import { GuestNav } from "./guest-nav";

export function UserNav({ showUpload = true }) {
  const supabase = createSupabaseComponentClient();

  const getMeQuery = useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        throw error;
      }
      return data;
    },
  });

  const user = get(getMeQuery, "data.user", null);

  const getBalanceQuery = useQuery({
    queryKey: ["balance"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("balance")
        .select("credits")
        .eq("user_id", user?.id)
        .single();
      if (error) {
        throw error;
      }
      return data;
    },
    enabled: !!user?.id,
  });

  const credits = get(getBalanceQuery, "data.credits", 0);

  if (!user) {
    return <GuestNav />;
  }

  return (
    <div className="flex gap-2 md:gap-4 items-center">
      {showUpload && <UploadButton />}

      <DropdownMenu
        onOpenChange={(isOpen) => {
          if (isOpen) {
            getBalanceQuery.refetch();
          }
        }}
      >
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-8 w-8">
              <AvatarImage
                src={user?.user_metadata?.picture}
                alt={user?.user_metadata?.full_name}
              />
              <AvatarFallback>
                {getInitials(user?.user_metadata?.full_name)}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" forceMount>
          <DropdownMenuLabel className="font-normal flex justify-between gap-4 items-start">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">
                {user?.user_metadata?.full_name}
              </p>
              <p className="text-xs leading-none text-muted-foreground">
                {user?.email}
              </p>
            </div>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Button
                    size="sm"
                    variant="outline"
                    className="rounded-full text-xs gap-1.5"
                  >
                    <Icons.clock className="size-5" />
                    {credits > 0
                      ? secondsToCreditsShort(credits)
                      : "No credits"}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {credits > 0
                    ? `You have ${secondsToCreditsLong(credits)} left.`
                    : "You have no credits left."}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="relative gap-2">
            <Link href="/dashboard" className="absolute inset-0 opacity-0">
              Go to dashbaord
            </Link>
            <Icons.document className="w-4 h-4" />
            Dashboard
          </DropdownMenuItem>
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
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="gap-2"
            onClick={() => (window.location.href = "/logout")}
          >
            <Icons.logout className="w-4 h-4" />
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
