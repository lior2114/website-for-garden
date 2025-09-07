import { useEffect, useRef } from 'react'
import { useRewards } from '../Contexts/RewardsContext'
import { useUser } from '../Contexts/UserContext'
import styles from './StarCounter.module.css'

const API_BASE = 'http://localhost:5000'

export default function StarCounter() {
  const { stars: localStars } = useRewards()
  const { user, isLoggedIn, updateUserStars } = useUser()

  // Prevent StrictMode double-effect and re-fetch loops
  const fetchedOnceRef = useRef(false)

  useEffect(() => {
    if (!isLoggedIn || !user?.user_id) return
    if (fetchedOnceRef.current) return
    fetchedOnceRef.current = true

    const fetchStars = async () => {
      try {
        const res = await fetch(`${API_BASE}/users/${user.user_id}`)
        if (!res.ok) return
        const data = await res.json()
        if (typeof data?.stars === 'number' && data.stars !== user.stars) {
          updateUserStars(data.stars)
        }
      } catch (_) {}
    }

    void fetchStars()
  }, [isLoggedIn, user?.user_id])

  const displayStars = isLoggedIn && user && typeof user.stars === 'number'
    ? user.stars
    : localStars

  return (
    <div className={styles.container}>
      ⭐ {displayStars}
    </div>
  )
}


