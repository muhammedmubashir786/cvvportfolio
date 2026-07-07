import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { LogoutButton } from "@/components/admin/LogoutButton";

// This runs on the SERVER before any /admin page renders. Because it's a
// layout, it wraps every route under /admin automatically — we only have
// to write this check once, not on every admin page.
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Being logged in isn't enough on its own — they also need to be in the
  // `admins` table (the same check our RLS policies use in the database).
  const { data: adminRow } = await supabase
    .from("admins")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!adminRow) {
    redirect("/login");
  }

  return (
    <div>
      <div className="section-container flex justify-end pt-6">
        <LogoutButton />
      </div>
      {children}
    </div>
  );
}
