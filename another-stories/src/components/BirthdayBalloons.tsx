//components/BirthdayBalloons.tsx
"use client"

import { useEffect, useState } from "react"
import confetti from "canvas-confetti"
import { motion } from "framer-motion"

export type BirthdayBalloonsProps = {
  names: string[]
}

export function BirthdayBalloons({ names }: BirthdayBalloonsProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted || names.length === 0) return null

  // Confetti burst when balloon clicked
  const handleConfetti = (name: string) => {
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 },
      colors: ["#FF7EB9", "#FF65A3", "#7AFDD6", "#FFF740"],
    })
    alert(`🎉 Happy Birthday 💕 ${name}!`)
  }

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-[9999]">
      {names.map((name, i) => (
        <motion.div
          key={i}
          initial={{
            y: "100%",
            x: Math.random() * window.innerWidth,
            opacity: 0,
          }}
          animate={{
            y: ["100%", "-10%"],
            opacity: [0.7, 1, 0],
          }}
          transition={{
            duration: 8 + Math.random() * 5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute bottom-0 text-4xl select-none pointer-events-auto cursor-pointer"
          onClick={() => handleConfetti(name)}
        >
          <span className="inline-block">{["🎈", "🎊", "🎉"][i % 3]}</span>
          <span className="ml-2 text-sm text-accent1 font-semibold">
            {name}
          </span>
        </motion.div>
      ))}
    </div>
  )
}
