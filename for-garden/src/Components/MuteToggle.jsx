import { useAudio } from '../Contexts/AudioContext'
import styles from './MuteToggle.module.css'

export default function MuteToggle() {
  const { muted, toggle } = useAudio()
  return (
    <button className={styles.container} onClick={toggle} aria-pressed={!muted}>
      {muted ? '🔇' : '🔊'}
    </button>
  )
}


