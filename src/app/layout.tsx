import type { Metadata } from "next";
import { Fraunces, Inter, JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "@/lib/theme-provider";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  style: ["normal", "italic"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "500"],
});

const siteUrl = "https://mmportfolio-one.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Muhammed Mubashir KP — SOC Analyst & Full-Stack Developer",
    template: "%s — Muhammed Mubashir KP",
  },
  description:
    "Certified SOC Analyst and full-stack web developer based in Kerala, India, specializing in Next.js, TypeScript, Supabase, and applied cybersecurity.",
  keywords: [
    "Muhammed Mubashir",
    "SOC Analyst",
    "Cybersecurity Researcher",
    "Full Stack Developer",
    "Next.js Developer",
    "Kerala Developer",
  ],
  authors: [{ name: "Muhammed Mubashir KP" }],
  openGraph: {
    title: "Muhammed Mubashir KP — SOC Analyst & Full-Stack Developer",
    description:
      "Certified SOC Analyst and full-stack web developer specializing in Next.js, TypeScript, Supabase, and applied cybersecurity.",
    url: siteUrl,
    siteName: "Muhammed Mubashir KP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Muhammed Mubashir KP — SOC Analyst & Full-Stack Developer",
    description:
      "Certified SOC Analyst and full-stack web developer specializing in Next.js, TypeScript, Supabase, and applied cybersecurity.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`dark ${fraunces.variable} ${inter.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <body className="antialiased">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
