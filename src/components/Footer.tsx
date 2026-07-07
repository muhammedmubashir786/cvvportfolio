export function Footer() {
  return (
    <footer className="border-t border-gold/10 py-8">
      <div className="section-container flex flex-col items-center justify-between gap-3 text-sm text-ink-muted md:flex-row">
        <p>&copy; {new Date().getFullYear()} Muhammed Mubashir KP. All rights reserved.</p>
        <p className="font-mono text-xs">Built with Next.js &amp; Tailwind CSS</p>
      </div>
    </footer>
  );
}
