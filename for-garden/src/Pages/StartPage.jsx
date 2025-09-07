import { useNavigate } from 'react-router-dom'
import { useUser } from '../Contexts/UserContext'
import Logo from '../Components/Logo'
import StartButton from '../Components/StartButton'
import MuteToggle from '../Components/MuteToggle'
import Navbar from '../Components/Navbar'
import styles from './StartPage.module.css'

export default function StartPage() {
  const navigate = useNavigate()
  const { user, isLoggedIn, logout, loginAsGuest } = useUser()

  if (!isLoggedIn) {
    return (
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.logoSection}>
            <Logo />
            <div className={styles.subtitle}>משחק לימוד עברית מהנה לילדים</div>
          </div>

          <div className={styles.authSection}>
            <p className={styles.authMessage}>היכנס או הירשם כדי להתחיל לשחק!</p>
            <div className={styles.authButtons}>
              <StartButton onClick={() => navigate('/login')}>היכנס</StartButton>
              <StartButton onClick={() => navigate('/register')}>הירשם</StartButton>
              <StartButton onClick={() => { loginAsGuest(); navigate('/levels') }}>היכנס כאורח</StartButton>
            </div>
          </div>
        </div>
      </div>
    )
  }
  return (
    <div className={styles.container}>
      <Navbar />
      
      <div className={styles.content}>
        <div className={styles.logoSection}>
          <Logo />
          <div className={styles.subtitle}>משחק לימוד עברית מהנה לילדים</div>
        </div>

        <div className={styles.gameInfo}>
          <h2 className={styles.infoTitle}>מה במשחק?</h2>
          <div className={styles.features}>
            <div className={styles.feature}>
              <div className={styles.featureIcon}>🔤</div>
              <div className={styles.featureText}>למד אותיות עבריות עם חיות חמודות</div>
            </div>
            <div className={styles.feature}>
              <div className={styles.featureIcon}>🎯</div>
              <div className={styles.featureText}>3 רמות קושי: קל, בינוני וקשה</div>
            </div>
            <div className={styles.feature}>
              <div className={styles.featureIcon}>⭐</div>
              <div className={styles.featureText}>אסוף כוכבים והגע לרמה הבאה!</div>
            </div>
            <div className={styles.feature}>
              <div className={styles.featureIcon}>🎉</div>
              <div className={styles.featureText}>חגיגות וקונפטי על כל תשובה נכונה</div>
            </div>
          </div>
        </div>

        <div className={styles.startSection}>
          <div className={styles.welcome}>
            שלום {user.first_name}! 👋 יש לך ⭐{user.stars || 0} כוכבים
          </div>
          <StartButton onClick={() => navigate('/levels')}>🚀 בואו נתחיל ללמוד! 🚀</StartButton>
          <p className={styles.encouragement}>מוכנים להרפתקה בעולם האותיות?</p>
          <button onClick={logout} className={styles.logout}>
            התנתק
          </button>
        </div>
      </div>
    </div>
  )
}


