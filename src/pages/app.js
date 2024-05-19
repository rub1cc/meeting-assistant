import { Button } from "@/components/ui/button";
import { createSupabaseComponentClient } from "@/lib/supabase/component";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { useRouter } from "next/router";

export default function Page({ user }) {
  const router = useRouter();
  const supabase = createSupabaseComponentClient();
  const handleLogout = () => {
    supabase.auth.signOut();
    router.reload();
  };
  return (
    <div className="p-4">
      <h1>Welcome, {user.email}</h1>
      <Button size="sm" onClick={handleLogout}>
        Logout
      </Button>
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
