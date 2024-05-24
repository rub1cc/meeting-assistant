import { Breadcrumbs } from "@/components/breadcrumbs";
import { Card } from "@/components/ui/card";
import { UserNav } from "@/components/user-nav";
import { createSupabaseComponentClient } from "@/lib/supabase/component";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { useQuery } from "@tanstack/react-query";
import { formatDistance } from "date-fns";
import Link from "next/link";

export default function Page({ user }) {
  const supabase = createSupabaseComponentClient();

  const getMyMeetingQuery = useQuery({
    queryKey: ["my-meetings", user.email],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("meetings")
        .select("id, title, summary, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        throw error;
      }

      return data;
    },
  });

  return (
    <div>
      <div className="p-4 flex justify-between items-center">
        <Breadcrumbs
          paths={[
            {
              label: "Dashboard",
            },
          ]}
        />
        <UserNav />
      </div>
      <main className="w-full max-w-4xl mx-auto mt-8 px-4 lg:px-0">
        <h1 className="border-b border-neutral-200 pb-4">Recent meetings</h1>
        <div className="mt-8">
          {getMyMeetingQuery.data && getMyMeetingQuery.data.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {getMyMeetingQuery.data.map((item) => (
                <Card
                  key={item.id}
                  className="p-4 hover:bg-neutral-100 min-h-[100px] flex justify-between flex-col gap-2 relative"
                >
                  <Link
                    className="absolute inset-0 opacity-0"
                    href={`/m/${item.id}`}
                  >
                    Open meeting {item.title}
                  </Link>
                  <h2 className="font-medium">{item.title}</h2>
                  <p className="text-sm line-clamp-3">{item.summary}</p>
                  <p className="text-sm text-neutral-500">
                    {formatDistance(new Date(item.created_at), new Date(), {
                      addSuffix: true,
                    })}
                  </p>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-neutral-500">
              You dont have any meetings yet. Add a new meeting to get started.
            </p>
          )}
        </div>
      </main>
    </div>
  );
}

export async function getServerSideProps(context) {
  const supabase = createSupabaseServerClient(context);

  const { data, error } = await supabase.auth.getUser();

  if (!data || error) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {
      user: data.user,
    },
  };
}
