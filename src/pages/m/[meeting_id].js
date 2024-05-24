import { Breadcrumbs } from "@/components/breadcrumbs";
import { Icons } from "@/components/icons";
import { LoadingSummary } from "@/components/loading-summary";
import { LoadingTranscript } from "@/components/loading-transcript";
import { Seo } from "@/components/seo";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserNav } from "@/components/user-nav";
import { createSupabaseComponentClient } from "@/lib/supabase/component";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { cn, secondsToHms } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import get from "lodash.get";
import { useRouter } from "next/router";
import { useRef, useState, useEffect } from "react";
import Markdown from "react-markdown";

export default function Page({ isOwner, meeting: defaultMeeting }) {
  const [meeting, setMeeting] = useState(defaultMeeting);
  const [currentTime, setCurrentTime] = useState(0);
  const [copied, setCopied] = useState(false);
  const ref = useRef(null);
  const supabase = createSupabaseComponentClient();
  const router = useRouter();

  const deleteMutation = useMutation({
    mutationFn: async () => {
      if (!isOwner) return;
      const { data, error } = await supabase
        .from("meetings")
        .delete()
        .eq("id", meeting.id);

      if (error) {
        throw new Error(error.message);
      }

      const fileKey = meeting.file_url.split("uploads/").pop();
      await supabase.storage.from("uploads").remove([fileKey]);

      return data;
    },
    onSuccess: () => {
      router.replace("/dashboard");
    },
    onError: () => {
      toast.error("Failed to delete meeting");
    },
  });

  useEffect(() => {
    if (!isOwner) return;
    if (meeting.transcript && meeting.summary && meeting.mom) return;

    const channel = supabase
      .channel("realtime_meeting")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "meetings",
          filter: "id=eq." + meeting.id,
        },
        (payload) => {
          console.log({ payload });
          setMeeting((old) => ({
            ...old,
            ...payload.new,
            id: meeting.id,
          }));
        }
      )
      .subscribe(console.log);

    return () => {
      channel && supabase.removeChannel(channel);
    };
  }, [supabase]);

  const play = (time) => {
    ref.current.currentTime = time;
    ref.current.play();
  };

  return (
    <>
      <Seo
        title={"Summary - " + defaultMeeting.title.split(".")[0]}
        description="Transcribe and summarize your meeting with Meeting Assistant."
      />
      <div className="w-screen h-screen flex flex-col">
        <div className="p-4 flex justify-between items-center border-b border-neutral-200">
          <Breadcrumbs
            paths={[
              ...(isOwner
                ? [
                    {
                      label: "Dashboard",
                      href: "/dashboard",
                    },
                  ]
                : []),
              {
                label: meeting.title,
              },
            ]}
          />
          <UserNav />
        </div>
        <main className="w-full h-full flex flex-col lg:flex-row lg:overflow-hidden">
          <div className="w-full bg-neutral-100 justify-center items-center flex flex-col gap-4 md:p-4 lg:p-8">
            <div className="pt-4 px-4 lg:p-0 self-end space-x-2">
              <Button
                variant="outline"
                className="rounded-full gap-2"
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 1000);
                }}
              >
                <Icons.share className="size-4" />
                {copied ? "Link copied!" : "Share"}
              </Button>

              {isOwner && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="rounded-full hover:text-red-500 gap-2"
                    >
                      <Icons.trash className="size-4" />
                      Remove
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Are you sure you want to delete this meeting?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. We can not recover the
                        media, transcript, and summary data after this meeting
                        is deleted.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <Button
                        variant="destructive"
                        onClick={() => {
                          if (deleteMutation.isPending || !isOwner) {
                            return;
                          }

                          deleteMutation.mutate();
                        }}
                      >
                        {deleteMutation.isPending ? (
                          <Icons.loading className="size-4" />
                        ) : (
                          "Delete"
                        )}
                      </Button>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </div>
            <div className="relative w-full bg-[#F1F3F4] border border-neutral-200 md:rounded-xl overflow-hidden">
              <span className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 text-2xl">
                No video available
              </span>
              <video
                ref={ref}
                controls
                src={meeting.file_url}
                className="w-full relative"
                onTimeUpdate={(e) => setCurrentTime(e.target.currentTime)}
              />
            </div>
          </div>
          <div className="w-full lg:max-w-[500px] lg:overflow-auto lg:flex-grow-0 border-l border-neutral-200">
            <Tabs defaultValue="summary">
              <div className="bg-white pb-2 flex justify-between items-center sticky top-0 z-10">
                <TabsList className="w-full rounded-none">
                  <TabsTrigger value="summary" className="w-full">
                    Summary
                    {meeting.summary && meeting.mom ? (
                      <Icons.check className="w-4 h-4 ml-2 text-green-500" />
                    ) : (
                      <Icons.loading className="w-4 h-4 ml-2 text-neutral-500" />
                    )}
                  </TabsTrigger>
                  <TabsTrigger value="transcript" className="w-full">
                    Transcript{" "}
                    {meeting.transcript ? (
                      <Icons.check className="w-4 h-4 ml-2 text-green-500" />
                    ) : (
                      <Icons.loading className="w-4 h-4 ml-2 text-neutral-500" />
                    )}
                  </TabsTrigger>
                </TabsList>
              </div>
              <TabsContent value="summary" className="px-4 lg:px-6">
                {meeting.summary ? (
                  <>
                    <p>{meeting.summary}</p>
                    <Markdown className="prose mt-8">{meeting.mom}</Markdown>
                  </>
                ) : (
                  <LoadingSummary />
                )}
              </TabsContent>
              <TabsContent value="transcript" className="px-4 lg:px-6">
                {meeting.transcript ? (
                  meeting.transcript.segments.map((item) => (
                    <div
                      key={item.text}
                      className={cn(
                        "rounded-md border border-transparent p-2 flex gap-2 justify-between items-start group relative",
                        currentTime >= item.start && currentTime < item.end
                          ? "bg-neutral-100 border-neutral-200"
                          : ""
                      )}
                    >
                      <div>
                        <p className="text-sm text-neutral-500">
                          {secondsToHms(item.start)}
                        </p>
                        <p className="w-full">{item.text}</p>
                      </div>
                      <button
                        onClick={() => play(item.start)}
                        className="absolute inset-0 opacity-0"
                      >
                        <Icons.playCircle className="w-6 h-6 text-neutral-500" />
                      </button>
                    </div>
                  ))
                ) : (
                  <LoadingTranscript />
                )}
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </>
  );
}

export async function getServerSideProps(context) {
  const supabase = createSupabaseServerClient(context);

  const resUser = await supabase.auth.getUser();
  const resSession = await supabase.auth.getSession();

  const resMeeting = await supabase
    .from("meetings")
    .select("id, title, file_url, summary, transcript, mom, user_id")
    .eq("id", context.params.meeting_id)
    .single();

  if (!resMeeting.data || resMeeting.error) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const { user_id, ...restMeeting } = resMeeting.data;
  const user = get(resUser, "data.user", {});

  return {
    props: {
      isOwner: resMeeting.data.user_id === user?.id,
      user: user,
      meeting: restMeeting,
      session: resSession.data,
    },
  };
}
