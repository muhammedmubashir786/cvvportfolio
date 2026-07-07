import { createClient } from "@/lib/supabase/server";
import type {
  Certification,
  Profile,
  Project,
  Skill,
  TimelineEntry,
} from "@/types";

export async function getProfile(): Promise<Profile | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profile")
    .select("*")
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error("getProfile failed:", error.message);
    return null;
  }
  return data;
}

export async function getSkills(): Promise<Skill[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("skills")
    .select("*")
    .order("category", { ascending: true })
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("getSkills failed:", error.message);
    return [];
  }
  return data ?? [];
}

export async function getProjects(): Promise<Project[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("getProjects failed:", error.message);
    return [];
  }
  return data ?? [];
}

export async function getCertifications(): Promise<Certification[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("certifications")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("getCertifications failed:", error.message);
    return [];
  }
  return data ?? [];
}

// Experience + Education are separate tables in the DB (different shapes,
// different admin forms) but the site shows them as one chronological
// "learning journey" timeline — so we merge and sort them here, once,
// rather than duplicating this logic in the component.
export async function getTimeline(): Promise<TimelineEntry[]> {
  const supabase = await createClient();

  const [{ data: experience, error: expError }, { data: education, error: eduError }] =
    await Promise.all([
      supabase.from("experience").select("*").order("sort_order", { ascending: true }),
      supabase.from("education").select("*").order("sort_order", { ascending: true }),
    ]);

  if (expError) console.error("getTimeline (experience) failed:", expError.message);
  if (eduError) console.error("getTimeline (education) failed:", eduError.message);

  const fromExperience: TimelineEntry[] = (experience ?? []).map((e) => ({
    id: e.id,
    kind: "experience" as const,
    title: e.role,
    subtitle: e.organization,
    start_date: e.start_date,
    end_date: e.end_date,
    description: e.description,
  }));

  const fromEducation: TimelineEntry[] = (education ?? []).map((e) => ({
    id: e.id,
    kind: "education" as const,
    title: e.degree,
    subtitle: e.institution,
    start_date: e.start_date,
    end_date: e.end_date,
    description: e.description,
  }));

  return [...fromExperience, ...fromEducation].sort((a, b) =>
    (a.start_date ?? "").localeCompare(b.start_date ?? "")
  );
}
