import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGame } from '../Contexts/GameContext'
import { useRewards } from '../Contexts/RewardsContext'
import { useUser } from '../Contexts/UserContext'
import Navbar from '../Components/Navbar'
import QuestionRenderer from '../Components/QuestionRenderer'
import styles from './QuestionPage.module.css'

const API_BASE = 'http://localhost:5000'

export default function QuestionPage() {
  const { currentQuestion, nextQuestion } = useGame()
  const { addStars } = useRewards()
  const { user, updateUserStars } = useUser()
  const navigate = useNavigate()
  const [answerCorrect, setAnswerCorrect] = useState(null)

  useEffect(() => {
    if (answerCorrect === true) {
      // הוסף כוכב בשרת
      addStarsToServer(1)
      setTimeout(() => {
        navigate('/correct')
      }, 300)
    } else if (answerCorrect === false) {
      setTimeout(() => navigate('/incorrect'), 300)
    }
  }, [answerCorrect, navigate])

  const addStarsToServer = async (starsAmount) => {
    if (!user || !user.user_id) return
    
    try {
      const response = await fetch(`${API_BASE}/users/${user.user_id}/add_stars`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stars: starsAmount })
      })
      
      if (response.ok) {
        // עדכן מקומית גם את ה-User וגם את ה-Rewards כדי שה-NAVBAR יתעדכן
        const newStarsTotal = (user.stars || 0) + starsAmount
        addStars(starsAmount)
        updateUserStars(newStarsTotal)
        // רענון נוסף מהשרת כדי לוודא סנכרון מלא
        try {
          const res = await fetch(`${API_BASE}/users/${user.user_id}`)
          if (res.ok) {
            const data = await res.json()
            if (typeof data?.stars === 'number') {
              updateUserStars(data.stars)
            }
          }
        } catch (_) {}
      }
    } catch (error) {
      console.error('Failed to add stars:', error)
    }
  }

  const handleCheck = (correct) => {
    setAnswerCorrect(correct)
    // Do not call nextQuestion() here on correct to avoid flashing the next question
  }

  return (
    <div className={styles.container}>
      <Navbar />
      <div className={styles.centerArea}>
        <QuestionRenderer question={currentQuestion} onAnswer={handleCheck} />
      </div>
      <div className={styles.interaction}> 
        <button className={styles.option} onClick={() => { nextQuestion(); setAnswerCorrect(null); }}>דלג שאלה</button>
      </div>
    </div>
  )
}


