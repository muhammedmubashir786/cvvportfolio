"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  return (
    <button
      onClick={handleLogout}
      className="glass inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium text-ink transition-colors hover:border-gold"
    >
      <LogOut className="h-3.5 w-3.5" aria-hidden="true" />
      Log Out
    </button>
  );
}
