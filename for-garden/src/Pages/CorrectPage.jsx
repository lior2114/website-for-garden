import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import ConfettiOverlay from '../Components/ConfettiOverlay'
import { useGame } from '../Contexts/GameContext'
import styles from './CorrectPage.module.css'

export default function CorrectPage() {
  const navigate = useNavigate()
  const { nextQuestion } = useGame()
  useEffect(() => {
    const t = setTimeout(() => {
      nextQuestion()
      navigate('/question')
    }, 1200)
    return () => clearTimeout(t)
  }, [navigate, nextQuestion])
  return (
    <div className={styles.container}>
      <ConfettiOverlay trigger={true} />
      <div className={styles.content}>
        <div className={styles.successIcon}>✅</div>
        <div className={styles.text}>כל הכבוד!</div>
        <div className={styles.subText}>תשובה מעולה! 🌟</div>
        <div className={styles.emoji}>👏</div>
        <div className={styles.message}>ממשיך לשאלה הבאה...</div>
      </div>
      <div className={styles.particles}></div>
    </div>
  )
}


