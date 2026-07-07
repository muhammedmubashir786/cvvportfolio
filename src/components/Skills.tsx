"use client";

import { motion } from "framer-motion";
import { SectionHeading } from "@/components/SectionHeading";
import type { Skill } from "@/types";

// Skills come from the database as a flat list of rows (one row per
// skill, each with a category string). We group them here for display
// rather than storing categories as a separate table — simpler schema,
// and grouping a few dozen rows in memory is cheap.
function groupByCategory(skills: Skill[]) {
  const groups = new Map<string, Skill[]>();
  for (const skill of skills) {
    const existing = groups.get(skill.category) ?? [];
    groups.set(skill.category, [...existing, skill]);
  }
  return Array.from(groups.entries()).map(([category, items]) => ({
    category,
    items,
  }));
}

export function Skills({ skills }: { skills: Skill[] }) {
  const categories = groupByCategory(skills);

  return (
    <section id="skills" className="py-24">
      <div className="section-container">
        <SectionHeading eyebrow="Skills" title="What I work with" />

        {categories.length === 0 ? (
          <p className="text-ink-muted">
            No skills added yet — add some in the admin dashboard.
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((group, i) => (
              <motion.div
                key={group.category}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: (i % 3) * 0.08 }}
                className="glass rounded-2xl p-6"
              >
                <h3 className="font-mono text-xs uppercase tracking-[0.2em] gold-text">
                  {group.category}
                </h3>
                <ul className="mt-5 space-y-4">
                  {group.items.map((skill) => (
                    <li key={skill.id}>
                      <div className="flex justify-between text-sm text-ink">
                        <span>{skill.name}</span>
                        <span className="text-ink-muted">{skill.level}%</span>
                      </div>
                      <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-white/5">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${skill.level}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.9, ease: "easeOut" }}
                          className="h-full rounded-full bg-gold"
                        />
                      </div>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
