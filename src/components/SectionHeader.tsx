type SectionHeaderProps = {
  eyebrow: string
  title: string
  description?: string
  align?: 'left' | 'center'
}

export function SectionHeader({ eyebrow, title, description, align = 'left' }: SectionHeaderProps) {
  return (
    <div className={align === 'center' ? 'mx-auto max-w-3xl text-center' : 'max-w-3xl'}>
      <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[#c92d2d]">{eyebrow}</p>
      <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">{title}</h2>
      {description ? <p className="mt-4 text-lg leading-8 text-slate-300">{description}</p> : null}
    </div>
  )
}
