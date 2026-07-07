"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useTheme } from "@/lib/theme-provider";
import type {
  Certification,
  Profile,
  Project,
  Skill,
  TerminalCommand,
  TimelineEntry,
} from "@/types";

interface TerminalProps {
  profile: Profile | null;
  skills: Skill[];
  projects: Project[];
  certifications: Certification[];
  timeline: TimelineEntry[];
  customCommands: TerminalCommand[];
}

type Line = { id: number; kind: "input" | "output" | "system"; text: string };

const BUILTIN_COMMANDS = [
  "help",
  "whoami",
  "about",
  "skills",
  "projects",
  "certifications",
  "experience",
  "education",
  "contact",
  "social",
  "github",
  "linkedin",
  "resume",
  "clear",
  "theme",
  "hack",
];

const QUICK_BUTTONS = [
  "help",
  "whoami",
  "skills",
  "projects",
  "certifications",
  "contact",
  "clear",
];

let lineId = 0;
const nextId = () => ++lineId;

// Reveals text progressively instead of dumping it all at once — mounts
// once per line (keyed by line.id in the parent) and types itself out,
// then stays static. Long blocks of text speed up automatically (more
// characters per tick) so a big "projects" listing doesn't take forever.
function TypedLine({
  text,
  className,
  onProgress,
}: {
  text: string;
  className: string;
  onProgress: () => void;
}) {
  const [shown, setShown] = useState("");

  useEffect(() => {
    let i = 0;
    const charsPerTick = Math.max(1, Math.ceil(text.length / 90));
    const interval = setInterval(() => {
      i += charsPerTick;
      setShown(text.slice(0, i));
      onProgress();
      if (i >= text.length) clearInterval(interval);
    }, 14);
    return () => clearInterval(interval);
    // Intentionally empty deps — this line's text never changes after
    // it's created, so we only want this animation to run once on mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <pre className={className}>{shown}</pre>;
}

export function Terminal({
  profile,
  skills,
  projects,
  certifications,
  timeline,
  customCommands,
}: TerminalProps) {
  const { toggleTheme } = useTheme();
  const [lines, setLines] = useState<Line[]>([
    { id: nextId(), kind: "system", text: `Welcome. Type "help" to see available commands.` },
  ]);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [lines]);

  const scrollToBottom = () => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  };

  const print = (text: string, kind: Line["kind"] = "output") => {
    setLines((prev) => [...prev, { id: nextId(), kind, text }]);
  };

  const runHack = async () => {
    const frames = [
      "Initializing connection...",
      "Bypassing firewall... [OK]",
      "Cracking encryption... [OK]",
      "Accessing mainframe...",
      "...",
      "Just kidding. I'm a SOC analyst, not a movie villain.",
      "Nice try though. Type 'help' for real commands.",
    ];
    for (const frame of frames) {
      await new Promise((r) => setTimeout(r, 350));
      print(frame, "system");
    }
  };

  const runCommand = async (raw: string) => {
    const cmd = raw.trim().toLowerCase();
    if (!cmd) return;

    print(`mubashir@portfolio:~$ ${raw}`, "input");
    setHistory((prev) => [...prev, raw]);
    setHistoryIndex(null);

    switch (cmd) {
      case "help": {
        const builtinList = BUILTIN_COMMANDS.map((c) => `  ${c}`).join("\n");
        const customList = customCommands.length
          ? "\n\nCustom commands:\n" +
            customCommands.map((c) => `  ${c.command}`).join("\n")
          : "";
        print(`Available commands:\n${builtinList}${customList}`);
        break;
      }
      case "whoami":
        print(
          `${profile?.name ?? "Unknown"} — ${profile?.title ?? "No title set"}`
        );
        break;
      case "about":
        print(profile?.bio ?? profile?.hero_text ?? "No bio set yet.");
        break;
      case "skills": {
        if (skills.length === 0) {
          print("No skills added yet.");
          break;
        }
        const byCategory = new Map<string, string[]>();
        for (const s of skills) {
          const list = byCategory.get(s.category) ?? [];
          list.push(`${s.name} (${s.level}%)`);
          byCategory.set(s.category, list);
        }
        const text = Array.from(byCategory.entries())
          .map(([cat, items]) => `${cat}:\n  ${items.join(", ")}`)
          .join("\n");
        print(text);
        break;
      }
      case "projects": {
        if (projects.length === 0) {
          print("No projects added yet.");
          break;
        }
        print(
          projects
            .map((p) => `${p.title} [${p.status}] — ${p.live_url ?? p.github_url ?? "no link"}`)
            .join("\n")
        );
        break;
      }
      case "certifications":
      case "certs":
        if (certifications.length === 0) {
          print("No certifications added yet.");
          break;
        }
        print(
          certifications
            .map((c) => `${c.title} — ${c.organization}`)
            .join("\n")
        );
        break;
      case "experience": {
        const exp = timeline.filter((t) => t.kind === "experience");
        print(
          exp.length
            ? exp.map((e) => `${e.title} @ ${e.subtitle}`).join("\n")
            : "No experience added yet."
        );
        break;
      }
      case "education": {
        const edu = timeline.filter((t) => t.kind === "education");
        print(
          edu.length
            ? edu.map((e) => `${e.title} — ${e.subtitle}`).join("\n")
            : "No education added yet."
        );
        break;
      }
      case "contact":
        print(
          [profile?.email, profile?.phone].filter(Boolean).join("\n") ||
            "No contact info set yet."
        );
        break;
      case "social":
        print(
          [profile?.github_url, profile?.linkedin_url]
            .filter(Boolean)
            .join("\n") || "No social links set yet."
        );
        break;
      case "github":
        if (profile?.github_url) {
          print(`Opening ${profile.github_url}`);
          window.open(profile.github_url, "_blank", "noopener,noreferrer");
        } else {
          print("No GitHub URL set yet.");
        }
        break;
      case "linkedin":
        if (profile?.linkedin_url) {
          print(`Opening ${profile.linkedin_url}`);
          window.open(profile.linkedin_url, "_blank", "noopener,noreferrer");
        } else {
          print("No LinkedIn URL set yet.");
        }
        break;
      case "resume":
        if (profile?.resume_url) {
          print(`Downloading resume from ${profile.resume_url}`);
          const a = document.createElement("a");
          a.href = profile.resume_url;
          a.download = "";
          a.click();
        } else {
          print("No resume uploaded yet.");
        }
        break;
      case "clear":
        setLines([]);
        return;
      case "theme":
        toggleTheme();
        print("Theme toggled.");
        break;
      case "hack":
        await runHack();
        break;
      default: {
        const custom = customCommands.find((c) => c.command === cmd);
        if (custom) {
          print(
            typeof custom.response === "string"
              ? custom.response
              : JSON.stringify(custom.response, null, 2)
          );
        } else {
          print(`Command not found: ${cmd}. Type "help" for a list.`);
        }
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    runCommand(input);
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (history.length === 0) return;
      const nextIndex =
        historyIndex === null ? history.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(nextIndex);
      setInput(history[nextIndex]);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex === null) return;
      const nextIndex = historyIndex + 1;
      if (nextIndex >= history.length) {
        setHistoryIndex(null);
        setInput("");
      } else {
        setHistoryIndex(nextIndex);
        setInput(history[nextIndex]);
      }
    } else if (e.key === "Tab") {
      e.preventDefault();
      const allCommands = [
        ...BUILTIN_COMMANDS,
        ...customCommands.map((c) => c.command),
      ];
      const match = allCommands.find((c) => c.startsWith(input.toLowerCase()));
      if (match) setInput(match);
    }
  };

  const allCommands = [...BUILTIN_COMMANDS, ...customCommands.map((c) => c.command)];
  const suggestions =
    input.length > 0
      ? allCommands.filter((c) => c.startsWith(input.toLowerCase()) && c !== input)
      : [];

  return (
    <section id="terminal" className="py-24">
      <div className="section-container">
        <span className="font-mono text-xs tracking-[0.25em] uppercase gold-text">
          Playground
        </span>
        <h2 className="mt-3 font-display text-3xl md:text-4xl font-semibold text-ink">
          Hack the Terminal
        </h2>
        <p className="mt-2 text-ink-muted">
          Type commands or click below.
        </p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
          className="mt-8 overflow-hidden rounded-2xl border border-gold/20 bg-[#0a0a0a]"
        >
          <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
            <span className="h-3 w-3 rounded-full bg-red-500/70" />
            <span className="h-3 w-3 rounded-full bg-yellow-500/70" />
            <span className="h-3 w-3 rounded-full bg-green-500/70" />
            <span className="ml-3 font-mono text-xs text-white/40">
              mubashir@portfolio:~
            </span>
          </div>

          <div
            ref={scrollRef}
            className="h-80 overflow-y-auto px-4 py-4 font-mono text-sm"
          >
            {lines.map((line) =>
              line.kind === "input" ? (
                <pre key={line.id} className="whitespace-pre-wrap break-words text-white">
                  {line.text}
                </pre>
              ) : (
                <TypedLine
                  key={line.id}
                  text={line.text}
                  onProgress={scrollToBottom}
                  className={`whitespace-pre-wrap break-words ${
                    line.kind === "system" ? "text-gold" : "text-white/70"
                  }`}
                />
              )
            )}
          </div>

          <form onSubmit={handleSubmit} className="relative border-t border-white/10 px-4 py-3">
            {suggestions.length > 0 && (
              <div className="absolute bottom-full left-4 mb-1 flex gap-2">
                {suggestions.slice(0, 4).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setInput(s)}
                    className="rounded bg-white/10 px-2 py-0.5 font-mono text-xs text-white/60 hover:bg-white/20"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
            <div className="flex items-center gap-2 font-mono text-sm">
              <span className="text-gold">$</span>
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="type a command..."
                autoComplete="off"
                spellCheck={false}
                aria-label="Terminal command input"
                className="flex-1 bg-transparent text-white outline-none placeholder:text-white/30"
              />
            </div>
          </form>
        </motion.div>

        <div className="mt-4 flex flex-wrap gap-2">
          {QUICK_BUTTONS.map((cmd) => (
            <button
              key={cmd}
              onClick={() => runCommand(cmd)}
              className="glass rounded-full px-4 py-1.5 font-mono text-xs uppercase tracking-wider text-ink-muted transition-colors hover:border-gold hover:text-ink"
            >
              {cmd}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
