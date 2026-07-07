"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Send } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/icons/BrandIcons";
import { SectionHeading } from "@/components/SectionHeading";
import type { Profile } from "@/types";

export function Contact({ profile }: { profile: Profile | null }) {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const contactEmail = profile?.email ?? "";

  const contactLinks = [
    profile?.email && {
      icon: Mail,
      label: "Email",
      value: profile.email,
      href: `mailto:${profile.email}`,
    },
    profile?.github_url && {
      icon: GithubIcon,
      label: "GitHub",
      value: profile.github_url.replace("https://github.com/", "@"),
      href: profile.github_url,
    },
    profile?.linkedin_url && {
      icon: LinkedinIcon,
      label: "LinkedIn",
      value: profile.linkedin_url.replace("https://www.linkedin.com/in/", ""),
      href: profile.linkedin_url,
    },
  ].filter(Boolean) as {
    icon: typeof Mail;
    label: string;
    value: string;
    href: string;
  }[];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactEmail) return;
    const subject = encodeURIComponent(`Portfolio inquiry from ${form.name}`);
    const body = encodeURIComponent(
      `${form.message}\n\n— ${form.name} (${form.email})`
    );
    window.location.href = `mailto:${contactEmail}?subject=${subject}&body=${body}`;
  };

  return (
    <section id="contact" className="py-24">
      <div className="section-container">
        <SectionHeading eyebrow="Contact" title="Let's work together" />

        <div className="grid gap-10 md:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            <p className="text-ink-muted">
              Open to SOC Analyst, cybersecurity, and full-stack roles across
              UAE, Qatar, and remote teams — and available for freelance web
              projects.
            </p>
            {contactLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target={link.href.startsWith("http") ? "_blank" : undefined}
                rel="noopener noreferrer"
                className="glass flex items-center gap-4 rounded-2xl p-4 transition-colors hover:border-gold/40"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gold/10">
                  <link.icon className="h-5 w-5 gold-text" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-ink-muted">
                    {link.label}
                  </p>
                  <p className="text-sm font-medium text-ink">{link.value}</p>
                </div>
              </a>
            ))}
          </motion.div>

          <motion.form
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
            onSubmit={handleSubmit}
            className="glass space-y-4 rounded-2xl p-6"
          >
            <div>
              <label htmlFor="name" className="text-xs uppercase tracking-wider text-ink-muted">
                Name
              </label>
              <input
                id="name"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="mt-1.5 w-full rounded-lg border border-gold/20 bg-transparent px-3.5 py-2.5 text-sm text-ink outline-none focus:border-gold"
                placeholder="Your name"
              />
            </div>
            <div>
              <label htmlFor="email" className="text-xs uppercase tracking-wider text-ink-muted">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="mt-1.5 w-full rounded-lg border border-gold/20 bg-transparent px-3.5 py-2.5 text-sm text-ink outline-none focus:border-gold"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label htmlFor="message" className="text-xs uppercase tracking-wider text-ink-muted">
                Message
              </label>
              <textarea
                id="message"
                required
                rows={4}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="mt-1.5 w-full resize-none rounded-lg border border-gold/20 bg-transparent px-3.5 py-2.5 text-sm text-ink outline-none focus:border-gold"
                placeholder="Tell me about the role or project..."
              />
            </div>
            <button
              type="submit"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gold px-6 py-3 font-medium text-bg transition-transform hover:scale-[1.02]"
            >
              <Send className="h-4 w-4" aria-hidden="true" />
              Send Message
            </button>
            <p className="text-center text-xs text-ink-muted">
              Opens your email app with the message pre-filled.
            </p>
          </motion.form>
        </div>
      </div>
    </section>
  );
}
