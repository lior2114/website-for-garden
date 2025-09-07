import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useUser } from '../Contexts/UserContext'
import { useRewards } from '../Contexts/RewardsContext'
import StartButton from '../Components/StartButton'
import styles from './RegisterPage.module.css'

export default function RegisterPage() {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const { register } = useUser()
  const { setStars } = useRewards()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (password.length < 4) {
      setError('הסיסמה חייבת להיות לפחות 4 תווים')
      setLoading(false)
      return
    }

    const result = await register(firstName, lastName, email, password)
    
    if (result.success) {
      // סנכרן כוכבים עם השרת (משתמש חדש מתחיל עם 0)
      setStars(result.data.stars || 0)
      navigate('/')
    } else {
      setError(result.error)
    }
    
    setLoading(false)
  }

  return (
    <div className={styles.container}>
      <div className={styles.registerBox}>
        <h1 className={styles.title}>צור חשבון חדש</h1>
        
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label>שם פרטי:</label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              className={styles.input}
            />
          </div>
          
          <div className={styles.inputGroup}>
            <label>שם משפחה:</label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
              className={styles.input}
            />
          </div>
          
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
              placeholder="לפחות 4 תווים"
            />
          </div>
          
          {error && <div className={styles.error}>{error}</div>}
          
          <StartButton disabled={loading}>
            {loading ? 'נרשם...' : 'הירשם'}
          </StartButton>
        </form>
        
        <div className={styles.links}>
          <Link to="/login" className={styles.link}>
            כבר יש לך חשבון? היכנס כאן
          </Link>
        </div>
      </div>
    </div>
  )
}
