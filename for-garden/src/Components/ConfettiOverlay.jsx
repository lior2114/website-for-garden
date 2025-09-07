import { useEffect } from 'react'
import confetti from 'canvas-confetti'
import styles from './ConfettiOverlay.module.css'

export default function ConfettiOverlay({ trigger }) {
  useEffect(() => {
    if (!trigger) return
    const durationMs = 800
    const end = Date.now() + durationMs

    const frame = () => {
      confetti({
        particleCount: 30,
        startVelocity: 40,
        spread: 55,
        origin: { y: 0.2 },
      })
      if (Date.now() < end) requestAnimationFrame(frame)
    }
    frame()
  }, [trigger])

  return <div className={styles.container} />
}


