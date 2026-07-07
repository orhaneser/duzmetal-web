import { useSpring, useTransform } from 'framer-motion'
import { useEffect, useState } from 'react'

type AnimatedCounterProps = {
  value: number
  suffix?: string
}

export function AnimatedCounter({ value, suffix = '' }: AnimatedCounterProps) {
  const [display, setDisplay] = useState(0)
  const spring = useSpring(0, { stiffness: 80, damping: 20 })
  const rounded = useTransform(spring, (current) => Math.round(current))

  useEffect(() => {
    spring.set(value)
  }, [spring, value])

  useEffect(() => {
    const unsubscribe = rounded.on('change', (latest) => {
      setDisplay(latest)
    })

    return () => unsubscribe()
  }, [rounded])

  return (
    <span>
      {display}
      {suffix}
    </span>
  )
}
