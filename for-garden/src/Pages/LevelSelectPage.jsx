import { useNavigate } from 'react-router-dom'
import { useGame } from '../Contexts/GameContext'
import styles from './LevelSelectPage.module.css'
import Navbar from '../Components/Navbar'

export default function LevelSelectPage() {
  const { setLevel } = useGame()
  const navigate = useNavigate()
  const choose = (lvl) => {
    setLevel(lvl)
    navigate('/question')
  }

  const levels = [
    {
      id: 'easy',
      name: 'רמה קלה',
      icon: '🌟',
      description: 'זיהוי אותיות בסיסי עם חיות',
      color: 'green',
      difficulty: '⭐'
    },
    {
      id: 'medium', 
      name: 'רמה בינונית',
      icon: '🎯',
      description: 'השלמת מילים והתאמות',
      color: 'orange',
      difficulty: '⭐⭐'
    },
    {
      id: 'hard',
      name: 'רמה קשה', 
      icon: '🚀',
      description: 'שילוב של כל סוגי השאלות',
      color: 'red',
      difficulty: '⭐⭐⭐'
    }
  ]

  return (
    <div className={styles.container}>
      <Navbar />
      
      <div className={styles.content}>
        <div className={styles.header}>
          <h1 className={styles.title}>בחר את הרמה שלך</h1>
          <p className={styles.subtitle}>איזו רמה מתאימה לך היום?</p>
        </div>

        <div className={styles.levelsGrid}>
          {levels.map((level) => (
            <div 
              key={level.id}
              className={`${styles.levelCard} ${styles[level.color]}`}
              onClick={() => choose(level.id)}
            >
              <div className={styles.levelIcon}>{level.icon}</div>
              <h3 className={styles.levelName}>{level.name}</h3>
              <div className={styles.difficulty}>{level.difficulty}</div>
              <p className={styles.levelDescription}>{level.description}</p>
              <div className={styles.startButton}>
                <span>בואו נתחיל!</span>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.tip}>
          <span className={styles.tipIcon}>💡</span>
          <span>טיפ: תתחיל ברמה הקלה ועלה בהדרגה!</span>
        </div>
      </div>
    </div>
  )
}


