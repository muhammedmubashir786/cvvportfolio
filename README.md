# Muhammed Mubashir KP — Portfolio

Personal portfolio site for Muhammed Mubashir KP — Cybersecurity Researcher,
SOC Analyst, and Full-Stack Developer.

Built with Next.js (App Router), TypeScript, Tailwind CSS, and Framer Motion.

## Stack

- **Next.js 16** (App Router, Turbopack)
- **TypeScript**
- **Tailwind CSS v4**
- **Framer Motion** for animations
- **lucide-react** for icons (custom SVGs for GitHub/LinkedIn brand marks)

## Getting started (Termux or any machine)

```bash
npm install
cp .env.local.example .env.local   # then edit ADMIN_PASSWORD
npm run dev
```

Visit `http://localhost:3000`.

> **Termux / Android note:** Next.js 16 defaults to Turbopack, which has no
> native bindings for `android/arm64` and will error out. The `dev` and
> `build` scripts in `package.json` already pass `--webpack` to avoid this —
> no action needed. If you ever see a Turbopack error, just add `--webpack`
> to the command.

## Project structure

```
src/
  app/
    page.tsx              # Home page, assembles all sections
    layout.tsx             # Fonts, SEO metadata, theme provider
    admin/page.tsx          # Password-protected content editor
    api/portfolio-data/     # Read/write API for projects & certifications
    sitemap.ts / robots.ts  # SEO
  components/               # One component per section (Hero, About, ...)
  data/                      # Editable JSON: portfolio-data.json, skills.json, timeline.json
  lib/theme-provider.tsx     # Dark/light mode context
  types/index.ts             # Shared TypeScript types
```

## Editing content

- **Projects & certifications**: edit `src/data/portfolio-data.json` directly,
  or use the `/admin` page (see below).
- **Skills**: edit `src/data/skills.json`.
- **Learning journey timeline**: edit `src/data/timeline.json`.
- **Profile photo**: replace `public/images/profile.jpg`.
- **Resume**: replace `public/resume/Muhammed-Mubashir-KP-Resume.pdf`.

## Admin panel (`/admin`)

The admin page lets you add, edit, and remove projects and certifications
through a form instead of hand-editing JSON.

1. Set `ADMIN_PASSWORD` in `.env.local` (local) or in your Vercel project's
   Environment Variables (production).
2. Visit `/admin`, enter the password, edit content, click **Save Changes**.

**Important limitation:** Vercel's production filesystem is read-only at
runtime. Saving from `/admin` works when running locally (`npm run dev` or
`npm start`), because it writes directly to `src/data/portfolio-data.json`.
On Vercel, a save attempt will fail. The intended workflow is:

1. Run the admin panel locally (e.g. in Termux) to update your data.
2. Commit the updated `portfolio-data.json`.
3. Push — Vercel redeploys with the new content.

This keeps the site fast (data is statically built in) without needing a
database. If you'd like live editing directly in production later, the next
step would be moving this JSON into Supabase (which you already use
elsewhere) — happy to wire that up on request.

## Deploying

This project deploys to Vercel exactly like any Next.js app:

```bash
git add .
git commit -m "Redesign portfolio with Next.js, TypeScript, Tailwind, Framer Motion"
git push origin main
```

Then in the Vercel dashboard, add the `ADMIN_PASSWORD` environment variable
to the project settings (Production + Preview) so `/admin` works if you ever
run it against a self-hosted instance.

## Notes

- Dark mode is the default; the toggle in the navbar switches to light mode
  and remembers the choice in `localStorage`.
- The contact form opens the visitor's email client with a pre-filled
  message (no backend/email service required).
