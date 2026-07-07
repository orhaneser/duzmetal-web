import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

type SectionProps = {
  id?: string
  eyebrow?: string
  title: string
  description?: string
  children: ReactNode
  align?: 'left' | 'center'
}

export function Section({ id, eyebrow, title, description, children, align = 'left' }: SectionProps) {
  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, y: 24, filter: 'blur(10px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-6 py-24 sm:px-8 lg:px-10"
    >
      <div className={align === 'center' ? 'mx-auto max-w-3xl text-center' : 'max-w-3xl'}>
        {eyebrow ? <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#b96c4f]">{eyebrow}</p> : null}
        <h2 className="mt-3 text-3xl font-semibold tracking-[-0.02em] text-stone-900 sm:text-4xl lg:text-[2.4rem]">{title}</h2>
        {description ? <p className="mt-4 text-lg leading-8 text-stone-600">{description}</p> : null}
      </div>
      {children}
    </motion.section>
  )
}
