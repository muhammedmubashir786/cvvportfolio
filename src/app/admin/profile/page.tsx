"use client";

import { useEffect, useState } from "react";
import { Save } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { Profile } from "@/types";

const FIELD_LABELS: { key: keyof Profile; label: string; multiline?: boolean }[] = [
  { key: "name", label: "Name" },
  { key: "title", label: "Title" },
  { key: "hero_text", label: "Hero Tagline (shown big on the homepage)" },
  { key: "bio", label: "Bio (blank line = new paragraph)", multiline: true },
  { key: "location", label: "Location" },
  { key: "resume_url", label: "Resume URL (e.g. /resume/yourfile.pdf)" },
  { key: "photo_url", label: "Photo URL (e.g. /images/profile.jpg)" },
  { key: "email", label: "Email" },
  { key: "phone", label: "Phone" },
  { key: "github_url", label: "GitHub URL" },
  { key: "linkedin_url", label: "LinkedIn URL" },
];

export default function AdminProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [status, setStatus] = useState("");

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("profile")
      .select("*")
      .limit(1)
      .maybeSingle()
      .then(({ data }) => setProfile(data));
  }, []);

  const save = async () => {
    if (!profile) return;
    setStatus("Saving...");
    const supabase = createClient();
    const { error } = await supabase
      .from("profile")
      .update(profile)
      .eq("id", profile.id);
    setStatus(error ? `Failed: ${error.message}` : "Saved.");
  };

  if (!profile) {
    return <p className="text-ink-muted">Loading...</p>;
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold text-ink">
          Profile &amp; Contact
        </h1>
        <button
          onClick={save}
          className="inline-flex items-center gap-2 rounded-full bg-gold px-5 py-2.5 font-medium text-bg"
        >
          <Save className="h-4 w-4" aria-hidden="true" />
          Save Changes
        </button>
      </div>
      {status && <p className="mt-2 text-sm gold-text">{status}</p>}

      <div className="mt-6 space-y-4">
        {FIELD_LABELS.map(({ key, label, multiline }) => (
          <div key={key}>
            <label className="text-xs uppercase tracking-wider text-ink-muted">
              {label}
            </label>
            {multiline ? (
              <textarea
                rows={5}
                value={profile[key] ?? ""}
                onChange={(e) =>
                  setProfile({ ...profile, [key]: e.target.value })
                }
                className="mt-1.5 w-full resize-none rounded-lg border border-gold/20 bg-transparent px-3.5 py-2.5 text-sm text-ink outline-none focus:border-gold"
              />
            ) : (
              <input
                value={profile[key] ?? ""}
                onChange={(e) =>
                  setProfile({ ...profile, [key]: e.target.value })
                }
                className="mt-1.5 w-full rounded-lg border border-gold/20 bg-transparent px-3.5 py-2.5 text-sm text-ink outline-none focus:border-gold"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
