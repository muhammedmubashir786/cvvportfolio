"use client";

import { useEffect, useState } from "react";
import { Trash2, Plus, Save } from "lucide-react";

// These types intentionally do NOT come from @/types anymore — those now
// describe the real Supabase tables (snake_case, DB-shaped) used by the
// public site. This admin page still edits the legacy JSON file for now;
// it gets replaced with real Supabase CRUD in the next step.
interface LegacyProject {
  id: string;
  title: string;
  description: string;
  tags: string[];
  status: "live" | "in-progress" | "archived";
  category: "web" | "security" | "mobile";
  liveUrl?: string;
  githubUrl?: string;
  featured?: boolean;
}

interface LegacyCertification {
  id: string;
  title: string;
  issuer: string;
  year: string;
  status: "completed" | "in-progress";
  credentialUrl?: string;
}

interface LegacyPortfolioData {
  projects: LegacyProject[];
  certifications: LegacyCertification[];
}

const emptyProject: LegacyProject = {
  id: "",
  title: "",
  description: "",
  tags: [],
  status: "live",
  category: "web",
  liveUrl: "",
  githubUrl: "",
  featured: false,
};

const emptyCert: LegacyCertification = {
  id: "",
  title: "",
  issuer: "",
  year: "",
  status: "completed",
  credentialUrl: "",
};

export default function AdminPage() {
  const [data, setData] = useState<LegacyPortfolioData | null>(null);
  const [status, setStatus] = useState("");

  useEffect(() => {
    fetch("/api/portfolio-data")
      .then((r) => r.json())
      .then(setData);
  }, []);

  const save = async () => {
    if (!data) return;
    setStatus("Saving...");
    const res = await fetch("/api/portfolio-data", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    setStatus(res.ok ? "Saved." : "Failed to save.");
  };

  if (!data) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-bg text-ink-muted">
        Loading...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-bg px-6 py-12">
      <div className="mx-auto max-w-4xl space-y-12">
        <div className="flex items-center justify-between">
          <h1 className="font-display text-2xl font-semibold text-ink">
            Portfolio Admin
          </h1>
          <button
            onClick={save}
            className="inline-flex items-center gap-2 rounded-full bg-gold px-5 py-2.5 font-medium text-bg"
          >
            <Save className="h-4 w-4" aria-hidden="true" />
            Save Changes
          </button>
        </div>
        {status && <p className="text-sm gold-text">{status}</p>}

        <section>
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold text-ink">
              Projects
            </h2>
            <button
              onClick={() =>
                setData({
                  ...data,
                  projects: [
                    ...data.projects,
                    { ...emptyProject, id: `project-${Date.now()}` },
                  ],
                })
              }
              className="glass inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-medium text-ink"
            >
              <Plus className="h-3.5 w-3.5" aria-hidden="true" />
              Add Project
            </button>
          </div>

          <div className="mt-4 space-y-4">
            {data.projects.map((project, i) => (
              <div key={project.id} className="glass rounded-2xl p-5">
                <div className="grid gap-3 sm:grid-cols-2">
                  <input
                    value={project.title}
                    onChange={(e) => {
                      const next = [...data.projects];
                      next[i] = { ...project, title: e.target.value };
                      setData({ ...data, projects: next });
                    }}
                    placeholder="Title"
                    className="rounded-lg border border-gold/20 bg-transparent px-3 py-2 text-sm text-ink outline-none focus:border-gold"
                  />
                  <select
                    value={project.status}
                    onChange={(e) => {
                      const next = [...data.projects];
                      next[i] = {
                        ...project,
                        status: e.target.value as LegacyProject["status"],
                      };
                      setData({ ...data, projects: next });
                    }}
                    className="rounded-lg border border-gold/20 bg-transparent px-3 py-2 text-sm text-ink outline-none focus:border-gold"
                  >
                    <option value="live">Live</option>
                    <option value="in-progress">In Progress</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
                <textarea
                  value={project.description}
                  onChange={(e) => {
                    const next = [...data.projects];
                    next[i] = { ...project, description: e.target.value };
                    setData({ ...data, projects: next });
                  }}
                  placeholder="Description"
                  rows={2}
                  className="mt-3 w-full resize-none rounded-lg border border-gold/20 bg-transparent px-3 py-2 text-sm text-ink outline-none focus:border-gold"
                />
                <div className="mt-3 grid gap-3 sm:grid-cols-3">
                  <input
                    value={project.tags.join(", ")}
                    onChange={(e) => {
                      const next = [...data.projects];
                      next[i] = {
                        ...project,
                        tags: e.target.value.split(",").map((t) => t.trim()).filter(Boolean),
                      };
                      setData({ ...data, projects: next });
                    }}
                    placeholder="Tags (comma separated)"
                    className="rounded-lg border border-gold/20 bg-transparent px-3 py-2 text-sm text-ink outline-none focus:border-gold"
                  />
                  <input
                    value={project.githubUrl ?? ""}
                    onChange={(e) => {
                      const next = [...data.projects];
                      next[i] = { ...project, githubUrl: e.target.value };
                      setData({ ...data, projects: next });
                    }}
                    placeholder="GitHub URL"
                    className="rounded-lg border border-gold/20 bg-transparent px-3 py-2 text-sm text-ink outline-none focus:border-gold"
                  />
                  <input
                    value={project.liveUrl ?? ""}
                    onChange={(e) => {
                      const next = [...data.projects];
                      next[i] = { ...project, liveUrl: e.target.value };
                      setData({ ...data, projects: next });
                    }}
                    placeholder="Live URL"
                    className="rounded-lg border border-gold/20 bg-transparent px-3 py-2 text-sm text-ink outline-none focus:border-gold"
                  />
                </div>
                <button
                  onClick={() =>
                    setData({
                      ...data,
                      projects: data.projects.filter((p) => p.id !== project.id),
                    })
                  }
                  className="mt-3 inline-flex items-center gap-1.5 text-xs text-red-400"
                >
                  <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                  Remove
                </button>
              </div>
            ))}
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold text-ink">
              Certifications
            </h2>
            <button
              onClick={() =>
                setData({
                  ...data,
                  certifications: [
                    ...data.certifications,
                    { ...emptyCert, id: `cert-${Date.now()}` },
                  ],
                })
              }
              className="glass inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-medium text-ink"
            >
              <Plus className="h-3.5 w-3.5" aria-hidden="true" />
              Add Certification
            </button>
          </div>

          <div className="mt-4 space-y-4">
            {data.certifications.map((cert, i) => (
              <div key={cert.id} className="glass grid gap-3 rounded-2xl p-5 sm:grid-cols-4">
                <input
                  value={cert.title}
                  onChange={(e) => {
                    const next = [...data.certifications];
                    next[i] = { ...cert, title: e.target.value };
                    setData({ ...data, certifications: next });
                  }}
                  placeholder="Title"
                  className="rounded-lg border border-gold/20 bg-transparent px-3 py-2 text-sm text-ink outline-none focus:border-gold sm:col-span-2"
                />
                <input
                  value={cert.issuer}
                  onChange={(e) => {
                    const next = [...data.certifications];
                    next[i] = { ...cert, issuer: e.target.value };
                    setData({ ...data, certifications: next });
                  }}
                  placeholder="Issuer"
                  className="rounded-lg border border-gold/20 bg-transparent px-3 py-2 text-sm text-ink outline-none focus:border-gold"
                />
                <input
                  value={cert.year}
                  onChange={(e) => {
                    const next = [...data.certifications];
                    next[i] = { ...cert, year: e.target.value };
                    setData({ ...data, certifications: next });
                  }}
                  placeholder="Year"
                  className="rounded-lg border border-gold/20 bg-transparent px-3 py-2 text-sm text-ink outline-none focus:border-gold"
                />
                <button
                  onClick={() =>
                    setData({
                      ...data,
                      certifications: data.certifications.filter((c) => c.id !== cert.id),
                    })
                  }
                  className="inline-flex items-center gap-1.5 text-xs text-red-400 sm:col-span-4"
                >
                  <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                  Remove
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
