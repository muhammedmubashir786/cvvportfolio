"use client";

import { useMemo, useState } from "react";
import { SectionHeading } from "@/components/SectionHeading";
import { ProjectCard } from "@/components/ProjectCard";
import type { Project } from "@/types";

const FILTERS: { id: "all" | string; label: string }[] = [
  { id: "all", label: "All" },
  { id: "web", label: "Web" },
  { id: "security", label: "Security" },
  { id: "mobile", label: "Mobile" },
];

export function Projects({ projects }: { projects: Project[] }) {
  const [filter, setFilter] = useState<string>("all");

  const filtered = useMemo(
    () =>
      filter === "all"
        ? projects
        : projects.filter((p) => p.category === filter),
    [filter, projects]
  );

  return (
    <section id="projects" className="py-24">
      <div className="section-container">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading eyebrow="Projects" title="Things I've built" />
          <div className="mb-12 flex gap-2">
            {FILTERS.map((f) => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={`rounded-full px-4 py-1.5 text-xs font-medium transition-colors ${
                  filter === f.id
                    ? "bg-gold text-bg"
                    : "glass text-ink-muted hover:text-ink"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {projects.length === 0 ? (
          <p className="text-ink-muted">
            No projects added yet — add some in the admin dashboard.
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((project, i) => (
              <ProjectCard key={project.id} project={project} index={i} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
