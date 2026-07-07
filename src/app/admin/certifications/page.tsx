"use client";

import { useEffect, useState } from "react";
import { Plus, Save, Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { Certification } from "@/types";

const emptyCert: Omit<Certification, "id"> = {
  title: "",
  organization: "",
  issue_date: null,
  image_url: null,
  credential_url: null,
  sort_order: 0,
};

export default function AdminCertificationsPage() {
  const [certs, setCerts] = useState<Certification[]>([]);
  const [status, setStatus] = useState("");

  const load = async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from("certifications")
      .select("*")
      .order("sort_order");
    setCerts(data ?? []);
  };

  useEffect(() => {
    load();
  }, []);

  const addCert = async () => {
    const supabase = createClient();
    const { error } = await supabase.from("certifications").insert(emptyCert);
    if (error) {
      setStatus(`Failed to add: ${error.message}`);
      return;
    }
    load();
  };

  const updateField = <K extends keyof Certification>(
    id: string,
    field: K,
    value: Certification[K]
  ) => {
    setCerts((prev) =>
      prev.map((c) => (c.id === id ? { ...c, [field]: value } : c))
    );
  };

  const saveCert = async (cert: Certification) => {
    setStatus("Saving...");
    const supabase = createClient();
    const { error } = await supabase
      .from("certifications")
      .update(cert)
      .eq("id", cert.id);
    setStatus(error ? `Failed: ${error.message}` : "Saved.");
  };

  const deleteCert = async (id: string) => {
    const supabase = createClient();
    const { error } = await supabase.from("certifications").delete().eq("id", id);
    if (error) {
      setStatus(`Failed to delete: ${error.message}`);
      return;
    }
    setCerts((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold text-ink">
          Certifications
        </h1>
        <button
          onClick={addCert}
          className="glass inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-medium text-ink"
        >
          <Plus className="h-3.5 w-3.5" aria-hidden="true" />
          Add Certification
        </button>
      </div>
      {status && <p className="mt-2 text-sm gold-text">{status}</p>}

      <div className="mt-6 space-y-3">
        {certs.map((cert) => (
          <div key={cert.id} className="glass rounded-2xl p-5">
            <div className="grid gap-3 sm:grid-cols-2">
              <input
                value={cert.title}
                onChange={(e) => updateField(cert.id, "title", e.target.value)}
                placeholder="Title"
                className="rounded-lg border border-gold/20 bg-transparent px-3 py-2 text-sm text-ink outline-none focus:border-gold"
              />
              <input
                value={cert.organization}
                onChange={(e) => updateField(cert.id, "organization", e.target.value)}
                placeholder="Organization"
                className="rounded-lg border border-gold/20 bg-transparent px-3 py-2 text-sm text-ink outline-none focus:border-gold"
              />
            </div>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <input
                type="date"
                value={cert.issue_date ?? ""}
                onChange={(e) => updateField(cert.id, "issue_date", e.target.value)}
                className="rounded-lg border border-gold/20 bg-transparent px-3 py-2 text-sm text-ink outline-none focus:border-gold"
              />
              <input
                value={cert.credential_url ?? ""}
                onChange={(e) => updateField(cert.id, "credential_url", e.target.value)}
                placeholder="Credential URL"
                className="rounded-lg border border-gold/20 bg-transparent px-3 py-2 text-sm text-ink outline-none focus:border-gold"
              />
            </div>
            <input
              value={cert.image_url ?? ""}
              onChange={(e) => updateField(cert.id, "image_url", e.target.value)}
              placeholder="Certificate image URL"
              className="mt-3 w-full rounded-lg border border-gold/20 bg-transparent px-3 py-2 text-sm text-ink outline-none focus:border-gold"
            />
            <div className="mt-4 flex gap-4">
              <button
                onClick={() => saveCert(cert)}
                className="inline-flex items-center gap-1.5 text-xs gold-text"
              >
                <Save className="h-3.5 w-3.5" aria-hidden="true" />
                Save
              </button>
              <button
                onClick={() => deleteCert(cert.id)}
                className="inline-flex items-center gap-1.5 text-xs text-red-400"
              >
                <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
