import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import ConfettiOverlay from '../Components/ConfettiOverlay'
import styles from './CelebrationPage.module.css'

export default function CelebrationPage() {
  const navigate = useNavigate()
  useEffect(() => {
    const t = setTimeout(() => navigate('/levels'), 2000)
    return () => clearTimeout(t)
  }, [navigate])
  return (
    <div className={styles.container}>
      <ConfettiOverlay trigger={true} />
      <div className={styles.content}>
        <div className={styles.crown}>👑</div>
        <div className={styles.text}>הגעת לרמה חדשה!</div>
        <div className={styles.subText}>מדהים! אתה אלוף! 🏆</div>
        <div className={styles.stars}>⭐ ⭐ ⭐ ⭐ ⭐</div>
        <div className={styles.emoji}>🎵🕺</div>
        <div className={styles.message}>חוזרים לבחירת רמה...</div>
      </div>
      <div className={styles.fireworks}></div>
      <div className={styles.sparkles}></div>
    </div>
  )
}


