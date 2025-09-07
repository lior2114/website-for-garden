import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useUser } from '../Contexts/UserContext'
import { useRewards } from '../Contexts/RewardsContext'
import StartButton from '../Components/StartButton'
import styles from './LoginPage.module.css'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const { login } = useUser()
  const { setStars } = useRewards()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const result = await login(email, password)
    
    if (result.success) {
      // סנכרן כוכבים עם השרת
      setStars(result.data.stars || 0)
      navigate('/')
    } else {
      setError(result.error)
    }
    
    setLoading(false)
  }

  return (
    <div className={styles.container}>
      <div className={styles.loginBox}>
        <h1 className={styles.title}>היכנס לחשבון</h1>
        
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label>אימייל:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={styles.input}
            />
          </div>
          
          <div className={styles.inputGroup}>
            <label>סיסמה:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className={styles.input}
            />
          </div>
          
          {error && <div className={styles.error}>{error}</div>}
          
          <StartButton disabled={loading}>
            {loading ? 'נכנס...' : 'היכנס'}
          </StartButton>
        </form>
        
        <div className={styles.links}>
          <Link to="/register" className={styles.link}>
            עוד אין לך חשבון? הירשם כאן
          </Link>
        </div>
      </div>
    </div>
  )
}
