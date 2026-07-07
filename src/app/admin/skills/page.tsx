"use client";

import { useEffect, useState } from "react";
import { Plus, Save, Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { Skill } from "@/types";

const emptySkill: Omit<Skill, "id"> = {
  category: "",
  name: "",
  icon: null,
  level: 50,
  sort_order: 0,
};

export default function AdminSkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [status, setStatus] = useState("");

  const load = async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from("skills")
      .select("*")
      .order("category")
      .order("sort_order");
    setSkills(data ?? []);
  };

  useEffect(() => {
    load();
  }, []);

  const addSkill = async () => {
    const supabase = createClient();
    const { error } = await supabase.from("skills").insert(emptySkill);
    if (error) {
      setStatus(`Failed to add: ${error.message}`);
      return;
    }
    load();
  };

  const updateField = (id: string, field: keyof Skill, value: string | number) => {
    setSkills((prev) =>
      prev.map((s) => (s.id === id ? { ...s, [field]: value } : s))
    );
  };

  const saveSkill = async (skill: Skill) => {
    setStatus("Saving...");
    const supabase = createClient();
    const { error } = await supabase
      .from("skills")
      .update(skill)
      .eq("id", skill.id);
    setStatus(error ? `Failed: ${error.message}` : "Saved.");
  };

  const deleteSkill = async (id: string) => {
    const supabase = createClient();
    const { error } = await supabase.from("skills").delete().eq("id", id);
    if (error) {
      setStatus(`Failed to delete: ${error.message}`);
      return;
    }
    setSkills((prev) => prev.filter((s) => s.id !== id));
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold text-ink">
          Skills
        </h1>
        <button
          onClick={addSkill}
          className="glass inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-medium text-ink"
        >
          <Plus className="h-3.5 w-3.5" aria-hidden="true" />
          Add Skill
        </button>
      </div>
      {status && <p className="mt-2 text-sm gold-text">{status}</p>}

      <div className="mt-6 space-y-3">
        {skills.map((skill) => (
          <div key={skill.id} className="glass rounded-2xl p-4">
            <div className="grid gap-3 sm:grid-cols-4">
              <input
                value={skill.category}
                onChange={(e) => updateField(skill.id, "category", e.target.value)}
                placeholder="Category"
                className="rounded-lg border border-gold/20 bg-transparent px-3 py-2 text-sm text-ink outline-none focus:border-gold"
              />
              <input
                value={skill.name}
                onChange={(e) => updateField(skill.id, "name", e.target.value)}
                placeholder="Skill name"
                className="rounded-lg border border-gold/20 bg-transparent px-3 py-2 text-sm text-ink outline-none focus:border-gold"
              />
              <input
                type="number"
                min={0}
                max={100}
                value={skill.level}
                onChange={(e) => updateField(skill.id, "level", Number(e.target.value))}
                placeholder="Level (0-100)"
                className="rounded-lg border border-gold/20 bg-transparent px-3 py-2 text-sm text-ink outline-none focus:border-gold"
              />
              <input
                type="number"
                value={skill.sort_order}
                onChange={(e) => updateField(skill.id, "sort_order", Number(e.target.value))}
                placeholder="Order"
                className="rounded-lg border border-gold/20 bg-transparent px-3 py-2 text-sm text-ink outline-none focus:border-gold"
              />
            </div>
            <div className="mt-3 flex gap-4">
              <button
                onClick={() => saveSkill(skill)}
                className="inline-flex items-center gap-1.5 text-xs gold-text"
              >
                <Save className="h-3.5 w-3.5" aria-hidden="true" />
                Save
              </button>
              <button
                onClick={() => deleteSkill(skill.id)}
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
