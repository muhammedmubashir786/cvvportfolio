// These types mirror the actual Postgres table columns in Supabase —
// snake_case, matching what the database returns, so there's no
// translation layer to keep in sync between DB and app.

export interface Profile {
  id: string;
  name: string;
  title: string;
  bio: string | null;
  hero_text: string | null;
  location: string | null;
  resume_url: string | null;
  email: string | null;
  phone: string | null;
  github_url: string | null;
  linkedin_url: string | null;
  photo_url: string | null;
}

export interface Skill {
  id: string;
  category: string;
  name: string;
  icon: string | null;
  level: number;
  sort_order: number;
}

export type ProjectStatus = "live" | "in_progress" | "archived";

export interface Project {
  id: string;
  title: string;
  description: string;
  tech_stack: string[];
  github_url: string | null;
  live_url: string | null;
  status: ProjectStatus;
  category: string;
  featured: boolean;
  sort_order: number;
}

export interface Certification {
  id: string;
  title: string;
  organization: string;
  issue_date: string | null;
  image_url: string | null;
  credential_url: string | null;
  sort_order: number;
}

// Experience and Education are separate tables, but the timeline UI
// displays them merged into one chronological list.
export interface TimelineEntry {
  id: string;
  kind: "experience" | "education";
  title: string;
  subtitle: string;
  start_date: string | null;
  end_date: string | null;
  description: string | null;
}
