import { createSupabaseServerClient } from "@/lib/supabase/server";

export default function Page() {
  return null;
}

export async function getServerSideProps(context) {
  const supabase = createSupabaseServerClient(context);

  await supabase.auth.signOut();

  return {
    redirect: {
      destination: "/",
      permanent: false,
    },
  };
}
