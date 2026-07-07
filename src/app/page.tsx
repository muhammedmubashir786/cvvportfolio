import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { Skills } from "@/components/Skills";
import { Projects } from "@/components/Projects";
import { Experience } from "@/components/Experience";
import { Certifications } from "@/components/Certifications";
import { Terminal } from "@/components/Terminal";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import {
  getCertifications,
  getProfile,
  getProjects,
  getSkills,
  getTerminalCommands,
  getTimeline,
} from "@/lib/queries";

// This page runs on the server at request time (or build time on Vercel,
// then revalidates) — all queries run in parallel via Promise.all rather
// than one after another, so the page isn't slowed down waiting on each.
export default async function Home() {
  const [profile, skills, projects, certifications, timeline, terminalCommands] =
    await Promise.all([
      getProfile(),
      getSkills(),
      getProjects(),
      getCertifications(),
      getTimeline(),
      getTerminalCommands(),
    ]);

  return (
    <>
      <Navbar />
      <main>
        <Hero profile={profile} />
        <About profile={profile} />
        <Skills skills={skills} />
        <Projects projects={projects} />
        <Experience timeline={timeline} />
        <Certifications certifications={certifications} />
        <Terminal
          profile={profile}
          skills={skills}
          projects={projects}
          certifications={certifications}
          timeline={timeline}
          customCommands={terminalCommands}
        />
        <Contact profile={profile} />
      </main>
      <Footer />
    </>
  );
}
