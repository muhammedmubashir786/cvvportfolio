"use client";

import { useEffect, useState } from "react";
import { Plus, Save, Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface EducationRow {
  id: string;
  degree: string;
  institution: string;
  start_date: string | null;
  end_date: string | null;
  description: string | null;
  sort_order: number;
}

const emptyRow: Omit<EducationRow, "id"> = {
  degree: "",
  institution: "",
  start_date: null,
  end_date: null,
  description: "",
  sort_order: 0,
};

export default function AdminEducationPage() {
  const [rows, setRows] = useState<EducationRow[]>([]);
  const [status, setStatus] = useState("");

  const load = async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from("education")
      .select("*")
      .order("sort_order");
    setRows(data ?? []);
  };

  useEffect(() => {
    load();
  }, []);

  const addRow = async () => {
    const supabase = createClient();
    const { error } = await supabase.from("education").insert(emptyRow);
    if (error) {
      setStatus(`Failed to add: ${error.message}`);
      return;
    }
    load();
  };

  const updateField = <K extends keyof EducationRow>(
    id: string,
    field: K,
    value: EducationRow[K]
  ) => {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, [field]: value } : r)));
  };

  const saveRow = async (row: EducationRow) => {
    setStatus("Saving...");
    const supabase = createClient();
    const { error } = await supabase.from("education").update(row).eq("id", row.id);
    setStatus(error ? `Failed: ${error.message}` : "Saved.");
  };

  const deleteRow = async (id: string) => {
    const supabase = createClient();
    const { error } = await supabase.from("education").delete().eq("id", id);
    if (error) {
      setStatus(`Failed to delete: ${error.message}`);
      return;
    }
    setRows((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold text-ink">
          Education
        </h1>
        <button
          onClick={addRow}
          className="glass inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-medium text-ink"
        >
          <Plus className="h-3.5 w-3.5" aria-hidden="true" />
          Add Education
        </button>
      </div>
      {status && <p className="mt-2 text-sm gold-text">{status}</p>}

      <div className="mt-6 space-y-3">
        {rows.map((row) => (
          <div key={row.id} className="glass rounded-2xl p-5">
            <div className="grid gap-3 sm:grid-cols-2">
              <input
                value={row.degree}
                onChange={(e) => updateField(row.id, "degree", e.target.value)}
                placeholder="Degree"
                className="rounded-lg border border-gold/20 bg-transparent px-3 py-2 text-sm text-ink outline-none focus:border-gold"
              />
              <input
                value={row.institution}
                onChange={(e) => updateField(row.id, "institution", e.target.value)}
                placeholder="Institution"
                className="rounded-lg border border-gold/20 bg-transparent px-3 py-2 text-sm text-ink outline-none focus:border-gold"
              />
            </div>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <div>
                <label className="text-xs text-ink-muted">Start date</label>
                <input
                  type="date"
                  value={row.start_date ?? ""}
                  onChange={(e) =>
                    updateField(row.id, "start_date", e.target.value || null)
                  }
                  className="mt-1 w-full rounded-lg border border-gold/20 bg-transparent px-3 py-2 text-sm text-ink outline-none focus:border-gold"
                />
              </div>
              <div>
                <label className="text-xs text-ink-muted">End date</label>
                <input
                  type="date"
                  value={row.end_date ?? ""}
                  onChange={(e) =>
                    updateField(row.id, "end_date", e.target.value || null)
                  }
                  className="mt-1 w-full rounded-lg border border-gold/20 bg-transparent px-3 py-2 text-sm text-ink outline-none focus:border-gold"
                />
              </div>
            </div>
            <textarea
              value={row.description ?? ""}
              onChange={(e) => updateField(row.id, "description", e.target.value)}
              placeholder="Description"
              rows={3}
              className="mt-3 w-full resize-none rounded-lg border border-gold/20 bg-transparent px-3 py-2 text-sm text-ink outline-none focus:border-gold"
            />
            <input
              type="number"
              value={row.sort_order}
              onChange={(e) => updateField(row.id, "sort_order", Number(e.target.value))}
              placeholder="Order"
              className="mt-3 w-24 rounded-lg border border-gold/20 bg-transparent px-3 py-2 text-sm text-ink outline-none focus:border-gold"
            />
            <div className="mt-4 flex gap-4">
              <button
                onClick={() => saveRow(row)}
                className="inline-flex items-center gap-1.5 text-xs gold-text"
              >
                <Save className="h-3.5 w-3.5" aria-hidden="true" />
                Save
              </button>
              <button
                onClick={() => deleteRow(row.id)}
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
