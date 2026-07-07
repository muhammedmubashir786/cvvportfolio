"use client";

import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { GithubIcon } from "@/components/icons/BrandIcons";
import type { Project } from "@/types";

const statusStyles: Record<Project["status"], string> = {
  live: "bg-emerald-500/10 text-emerald-400",
  in_progress: "bg-gold/10 text-gold",
  archived: "bg-white/5 text-ink-muted",
};

const statusLabel: Record<Project["status"], string> = {
  live: "Live",
  in_progress: "In Progress",
  archived: "Archived",
};

export function ProjectCard({ project, index }: { project: Project; index: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: (index % 3) * 0.08 }}
      className="glass flex h-full flex-col rounded-2xl p-6 transition-colors hover:border-gold/40"
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-display text-lg font-semibold text-ink">
          {project.title}
        </h3>
        <span
          className={`shrink-0 rounded-full px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider ${statusStyles[project.status]}`}
        >
          {statusLabel[project.status]}
        </span>
      </div>

      <p className="mt-3 flex-1 text-sm text-ink-muted">
        {project.description}
      </p>

      <div className="mt-5 flex flex-wrap gap-2">
        {project.tech_stack.map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-gold/20 px-2.5 py-1 font-mono text-[11px] text-ink-muted"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="mt-6 flex gap-3">
        {project.github_url && (
          <a
            href={project.github_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full glass px-4 py-2 text-xs font-medium text-ink transition-colors hover:border-gold"
          >
            <GithubIcon className="h-3.5 w-3.5" aria-hidden="true" />
            Code
          </a>
        )}
        {project.live_url && (
          <a
            href={project.live_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full bg-gold px-4 py-2 text-xs font-medium text-bg transition-transform hover:scale-[1.03]"
          >
            <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
            Live Demo
          </a>
        )}
      </div>
    </motion.article>
  );
}
