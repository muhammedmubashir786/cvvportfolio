import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

const MODULES = [
  { href: "/admin/profile", label: "Profile & Contact", table: "profile" },
  { href: "/admin/skills", label: "Skills", table: "skills" },
  { href: "/admin/projects", label: "Projects", table: "projects" },
  { href: "/admin/certifications", label: "Certifications", table: "certifications" },
  { href: "/admin/experience", label: "Experience", table: "experience" },
  { href: "/admin/education", label: "Education", table: "education" },
];

export default async function AdminOverviewPage() {
  const supabase = await createClient();

  // One quick count per table so you can see at a glance what's empty.
  const counts = await Promise.all(
    MODULES.map(async (m) => {
      const { count } = await supabase
        .from(m.table)
        .select("*", { count: "exact", head: true });
      return { ...m, count: count ?? 0 };
    })
  );

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-ink">
        Portfolio Admin
      </h1>
      <p className="mt-2 text-sm text-ink-muted">
        Everything here reads and writes your live Supabase database directly
        — changes appear on the public site as soon as you save.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {counts.map((m) => (
          <Link
            key={m.href}
            href={m.href}
            className="glass flex items-center justify-between rounded-2xl p-5 transition-colors hover:border-gold/40"
          >
            <span className="font-display text-lg font-semibold text-ink">
              {m.label}
            </span>
            <span className="rounded-full bg-gold/10 px-3 py-1 font-mono text-xs gold-text">
              {m.count} {m.count === 1 ? "row" : "rows"}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
