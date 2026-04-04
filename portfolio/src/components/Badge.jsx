/**
 * Badge/chip component for tech tags, categories, labels.
 * @param {string} variant - 'default' | 'mono' | 'signal' | 'ghost'
 */
export default function Badge({ children, variant = 'default', className = '' }) {
  const variants = {
    default:
      'text-ink-tertiary bg-surface-2 border border-wire text-[11px] font-mono tracking-wide px-2 py-0.5 rounded',
    mono:
      'text-ink-secondary bg-transparent border border-wire-bright text-[11px] font-mono tracking-widest uppercase px-2.5 py-1 rounded',
    signal:
      'text-signal bg-surface-2 border border-signal/20 text-[11px] font-mono tracking-wide px-2 py-0.5 rounded',
    ghost:
      'text-ink-tertiary text-[11px] font-mono tracking-widest uppercase',
  }

  return (
    <span className={`inline-block ${variants[variant]} ${className}`}>
      {children}
    </span>
  )
}
