import { motion } from 'framer-motion'

type StatCardProps = {
  value: string
  label: string
}

export function StatCard({ value, label }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="rounded-[1.5rem] border border-stone-200 bg-[#faf7f2] p-6 text-center shadow-[0_20px_60px_rgba(15,23,42,0.03)]"
    >
      <p className="text-4xl font-semibold tracking-tight text-stone-900">{value}</p>
      <p className="mt-2 text-sm uppercase tracking-[0.28em] text-stone-500">{label}</p>
    </motion.div>
  )
}
