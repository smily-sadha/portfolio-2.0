import { SITE_CONFIG } from '../constants/config'

export default function Footer() {
  return (
    <footer className="border-t border-wire/40 mt-8">
      <div className="max-w-5xl mx-auto px-6 md:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="font-mono text-xs text-ink-ghost">
          © {new Date().getFullYear()} {SITE_CONFIG.name}
        </p>
        <p className="font-mono text-xs text-ink-ghost">
          Built with React · Tailwind · Framer Motion
        </p>
      </div>
    </footer>
  )
}
