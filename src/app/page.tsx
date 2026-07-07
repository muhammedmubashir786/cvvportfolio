import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { Skills } from "@/components/Skills";
import { Projects } from "@/components/Projects";
import { Experience } from "@/components/Experience";
import { Certifications } from "@/components/Certifications";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import {
  getCertifications,
  getProfile,
  getProjects,
  getSkills,
  getTimeline,
} from "@/lib/queries";

// This page runs on the server at request time (or build time on Vercel,
// then revalidates) — all five Supabase queries run in parallel via
// Promise.all rather than one after another, so the page isn't slowed
// down by waiting on each query in sequence.
export default async function Home() {
  const [profile, skills, projects, certifications, timeline] =
    await Promise.all([
      getProfile(),
      getSkills(),
      getProjects(),
      getCertifications(),
      getTimeline(),
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
        <Contact profile={profile} />
      </main>
      <Footer />
    </>
  );
}
