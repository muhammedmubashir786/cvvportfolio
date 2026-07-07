"use client";

import { motion } from "framer-motion";
import { SectionHeading } from "@/components/SectionHeading";
import { ShieldCheck, Code2, GraduationCap } from "lucide-react";
import type { Profile } from "@/types";

const PILLARS = [
  {
    icon: ShieldCheck,
    title: "Cybersecurity-first mindset",
    text: "I build with secure development practices baked in, not bolted on — from threat modeling to hardened auth.",
  },
  {
    icon: Code2,
    title: "Full-stack execution",
    text: "Next.js, TypeScript, Tailwind CSS, and Supabase let me take a product from schema to shipped UI.",
  },
  {
    icon: GraduationCap,
    title: "Always in the lab",
    text: "Daily practice on PortSwigger Web Security Academy and hands-on SIEM work keeps my skills current.",
  },
];

export function About({ profile }: { profile: Profile | null }) {
  // Bio supports multiple paragraphs if you separate them with a blank
  // line in the admin dashboard textarea — otherwise it renders as one.
  const paragraphs = (profile?.bio ?? "Add your bio in the admin dashboard.")
    .split(/\n\s*\n/)
    .filter(Boolean);

  return (
    <section id="about" className="py-24">
      <div className="section-container">
        <SectionHeading eyebrow="About" title="Security-minded, product-driven" />

        <div className="grid gap-12 md:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
            className="space-y-5 text-ink-muted"
          >
            {paragraphs.map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </motion.div>

          <div className="grid gap-5">
            {PILLARS.map((pillar, i) => (
              <motion.div
                key={pillar.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="glass flex gap-4 rounded-2xl p-6"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gold/10">
                  <pillar.icon className="h-5 w-5 gold-text" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="font-display text-lg font-semibold text-ink">
                    {pillar.title}
                  </h3>
                  <p className="mt-1.5 text-sm text-ink-muted">
                    {pillar.text}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
