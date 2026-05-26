type OwltreeMarkProps = {
  className?: string
}

export function OwltreeMark({ className }: OwltreeMarkProps) {
  const iconUrl = `${import.meta.env.BASE_URL}owltree-icon.svg`

  return (
    <span className={['t-brand-mark-shell', className].filter(Boolean).join(' ')} aria-hidden="true">
      <img className="t-brand-mark" src={iconUrl} alt="" />
    </span>
  )
}
