import { useEffect, useRef } from 'react'
import { useAudio } from '../Contexts/AudioContext'
import styles from './BackgroundMusic.module.css'

export default function BackgroundMusic() {
  const { muted } = useAudio()
  const audioEl = useRef(null)

  useEffect(() => {
    const el = audioEl.current
    if (!el) return
    if (muted) {
      el.pause()
    } else {
      el.volume = 0.25
      el.play().catch(() => {})
    }
  }, [muted])

  return (
    <audio className={styles.container} ref={audioEl} loop>
      {/* Add a bg music file under public/ and uncomment source */}
      {/* <source src="/bg-music.mp3" type="audio/mpeg" /> */}
    </audio>
  )
}


