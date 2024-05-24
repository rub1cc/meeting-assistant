import { Breadcrumbs } from "@/components/breadcrumbs";
import { Icons } from "@/components/icons";
import { LoadingSummary } from "@/components/loading-summary";
import { LoadingTranscript } from "@/components/loading-transcript";
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
import { secondsToHms } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import Markdown from "react-markdown";
import { toast } from "sonner";

export default function Page({ meeting: defaultMeeting }) {
  const supabase = createSupabaseComponentClient();
  const [meeting, setMeeting] = useState(defaultMeeting);
  const ref = useRef(null);
  const router = useRouter();

  const deleteMutation = useMutation({
    mutationFn: async () => {
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
    <div>
      <div className="p-4 flex justify-between items-center sticky top-0">
        <Breadcrumbs
          paths={[
            {
              href: "/dashboard",
              label: "Dashboard",
            },
            {
              label: meeting.title,
            },
          ]}
        />
        <UserNav />
      </div>
      <main className="w-full max-w-[70ch] mx-auto mt-8 gap-8 h-full pb-[150px] px-4 lg:px-0">
        <Tabs defaultValue="summary">
          <div className="sticky top-0 bg-white py-4 flex justify-between items-center">
            <TabsList>
              <TabsTrigger value="summary">
                Summary
                {meeting.summary && meeting.mom ? (
                  <Icons.check className="w-4 h-4 ml-2 text-green-500" />
                ) : (
                  <Icons.loading className="w-4 h-4 ml-2 text-neutral-500" />
                )}
              </TabsTrigger>
              <TabsTrigger value="transcript">
                Transcript{" "}
                {meeting.transcript ? (
                  <Icons.check className="w-4 h-4 ml-2 text-green-500" />
                ) : (
                  <Icons.loading className="w-4 h-4 ml-2 text-neutral-500" />
                )}
              </TabsTrigger>
            </TabsList>

            <AlertDialog>
              <AlertDialogTrigger>
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-2 text-red-500 hover:text-red-500 hover:bg-red-50"
                >
                  <Icons.trash className="w-4 h-4" />
                  <span className="hidden md:inline">Remove</span>
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Are you sure you want to delete this meeting?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. We can not recover the media,
                    transcript, and summary data after this meeting is deleted.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <Button
                    variant="destructive"
                    onClick={() => {
                      if (deleteMutation.isPending) {
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
          </div>
          <TabsContent value="summary" className="pt-2">
            {meeting.summary ? (
              <>
                <p>{meeting.summary}</p>
                <Markdown className="prose mt-8">{meeting.mom}</Markdown>
              </>
            ) : (
              <LoadingSummary />
            )}
          </TabsContent>
          <TabsContent value="transcript" className="space-y-4 py-2">
            {meeting.transcript ? (
              meeting.transcript.segments.map((item) => (
                <div
                  key={item.text}
                  className="bg-neutral-100 rounded-2xl p-4 rounded-bl-none flex gap-2 justify-between items-start group"
                >
                  <div>
                    <p className="text-sm text-neutral-500">
                      {secondsToHms(item.start)}
                    </p>
                    <p>{item.text}</p>
                  </div>
                  <button
                    onClick={() => play(item.start)}
                    className="opacity-0 group-hover:opacity-100"
                  >
                    <Icons.playCircle className="w-6 h-6" />
                  </button>
                </div>
              ))
            ) : (
              <LoadingTranscript />
            )}
          </TabsContent>
        </Tabs>

        <div className="fixed bottom-0 inset-x-0 bg-white flex justify-center w-full py-4 px-4 lg:px-0">
          <audio
            ref={ref}
            controls
            src={meeting.file_url}
            className="w-full max-w-[70ch]"
          />
        </div>
      </main>
    </div>
  );
}

export async function getServerSideProps(context) {
  const supabase = createSupabaseServerClient(context);

  const resUser = await supabase.auth.getUser();
  const resSession = await supabase.auth.getSession();

  if (!resUser.data || resUser.error) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const resMeeting = await supabase
    .from("meetings")
    .select("*")
    .eq("id", context.params.meeting_id)
    .single();

  if (!resMeeting.data || resMeeting.error) {
    return {
      redirect: {
        destination: "/dashboard",
        permanent: false,
      },
    };
  }

  return {
    props: {
      user: resUser.data.user,
      meeting: resMeeting.data,
      session: resSession.data,
    },
  };
}
