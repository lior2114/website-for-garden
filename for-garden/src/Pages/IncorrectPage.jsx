import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './IncorrectPage.module.css'

export default function IncorrectPage() {
  const navigate = useNavigate()
  useEffect(() => {
    const t = setTimeout(() => navigate('/question'), 1200)
    return () => clearTimeout(t)
  }, [navigate])
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.icon}>🤔</div>
        <div className={styles.text}>נסה שוב</div>
        <div className={styles.subText}>לא נורא, נוסיך לנסות! 💪</div>
        <div className={styles.emoji}>😊</div>
        <div className={styles.message}>חוזרים לשאלה...</div>
      </div>
      <div className={styles.particles}></div>
    </div>
  )
}


