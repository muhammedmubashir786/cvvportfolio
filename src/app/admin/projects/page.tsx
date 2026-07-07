"use client";

import { useEffect, useState } from "react";
import { Plus, Save, Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { Project } from "@/types";

const emptyProject: Omit<Project, "id"> = {
  title: "",
  description: "",
  tech_stack: [],
  github_url: null,
  live_url: null,
  status: "live",
  category: "web",
  featured: false,
  sort_order: 0,
};

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [status, setStatus] = useState("");

  const load = async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from("projects")
      .select("*")
      .order("sort_order");
    setProjects(data ?? []);
  };

  useEffect(() => {
    load();
  }, []);

  const addProject = async () => {
    const supabase = createClient();
    const { error } = await supabase.from("projects").insert(emptyProject);
    if (error) {
      setStatus(`Failed to add: ${error.message}`);
      return;
    }
    load();
  };

  const updateField = <K extends keyof Project>(
    id: string,
    field: K,
    value: Project[K]
  ) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, [field]: value } : p))
    );
  };

  const saveProject = async (project: Project) => {
    setStatus("Saving...");
    const supabase = createClient();
    const { error } = await supabase
      .from("projects")
      .update(project)
      .eq("id", project.id);
    setStatus(error ? `Failed: ${error.message}` : "Saved.");
  };

  const deleteProject = async (id: string) => {
    const supabase = createClient();
    const { error } = await supabase.from("projects").delete().eq("id", id);
    if (error) {
      setStatus(`Failed to delete: ${error.message}`);
      return;
    }
    setProjects((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold text-ink">
          Projects
        </h1>
        <button
          onClick={addProject}
          className="glass inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-medium text-ink"
        >
          <Plus className="h-3.5 w-3.5" aria-hidden="true" />
          Add Project
        </button>
      </div>
      {status && <p className="mt-2 text-sm gold-text">{status}</p>}

      <div className="mt-6 space-y-4">
        {projects.map((project) => (
          <div key={project.id} className="glass rounded-2xl p-5">
            <div className="grid gap-3 sm:grid-cols-2">
              <input
                value={project.title}
                onChange={(e) => updateField(project.id, "title", e.target.value)}
                placeholder="Title"
                className="rounded-lg border border-gold/20 bg-transparent px-3 py-2 text-sm text-ink outline-none focus:border-gold"
              />
              <select
                value={project.status}
                onChange={(e) =>
                  updateField(project.id, "status", e.target.value as Project["status"])
                }
                className="rounded-lg border border-gold/20 bg-transparent px-3 py-2 text-sm text-ink outline-none focus:border-gold"
              >
                <option value="live">Live</option>
                <option value="in_progress">In Progress</option>
                <option value="archived">Archived</option>
              </select>
            </div>
            <textarea
              value={project.description}
              onChange={(e) => updateField(project.id, "description", e.target.value)}
              placeholder="Description"
              rows={2}
              className="mt-3 w-full resize-none rounded-lg border border-gold/20 bg-transparent px-3 py-2 text-sm text-ink outline-none focus:border-gold"
            />
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <input
                value={project.tech_stack.join(", ")}
                onChange={(e) =>
                  updateField(
                    project.id,
                    "tech_stack",
                    e.target.value.split(",").map((t) => t.trim()).filter(Boolean)
                  )
                }
                placeholder="Tech stack (comma separated)"
                className="rounded-lg border border-gold/20 bg-transparent px-3 py-2 text-sm text-ink outline-none focus:border-gold"
              />
              <select
                value={project.category}
                onChange={(e) => updateField(project.id, "category", e.target.value)}
                className="rounded-lg border border-gold/20 bg-transparent px-3 py-2 text-sm text-ink outline-none focus:border-gold"
              >
                <option value="web">Web</option>
                <option value="security">Security</option>
                <option value="mobile">Mobile</option>
              </select>
            </div>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <input
                value={project.github_url ?? ""}
                onChange={(e) => updateField(project.id, "github_url", e.target.value)}
                placeholder="GitHub URL"
                className="rounded-lg border border-gold/20 bg-transparent px-3 py-2 text-sm text-ink outline-none focus:border-gold"
              />
              <input
                value={project.live_url ?? ""}
                onChange={(e) => updateField(project.id, "live_url", e.target.value)}
                placeholder="Live URL"
                className="rounded-lg border border-gold/20 bg-transparent px-3 py-2 text-sm text-ink outline-none focus:border-gold"
              />
            </div>
            <div className="mt-3 flex items-center gap-4">
              <label className="flex items-center gap-2 text-sm text-ink-muted">
                <input
                  type="checkbox"
                  checked={project.featured}
                  onChange={(e) => updateField(project.id, "featured", e.target.checked)}
                />
                Featured
              </label>
              <input
                type="number"
                value={project.sort_order}
                onChange={(e) => updateField(project.id, "sort_order", Number(e.target.value))}
                placeholder="Order"
                className="w-24 rounded-lg border border-gold/20 bg-transparent px-3 py-2 text-sm text-ink outline-none focus:border-gold"
              />
            </div>
            <div className="mt-4 flex gap-4">
              <button
                onClick={() => saveProject(project)}
                className="inline-flex items-center gap-1.5 text-xs gold-text"
              >
                <Save className="h-3.5 w-3.5" aria-hidden="true" />
                Save
              </button>
              <button
                onClick={() => deleteProject(project.id)}
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
