import { useEffect, useState } from 'react'
import { useUser } from '../Contexts/UserContext'
import Navbar from '../Components/Navbar'
import styles from './ProfilePage.module.css'

const API_BASE = 'http://localhost:5000'

export default function ProfilePage() {
  const { user, updateUserFields } = useUser()
  const [userAnimals, setUserAnimals] = useState([])
  const [allAnimals, setAllAnimals] = useState({})
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    Promise.all([
      fetchUserAnimals(),
      fetchAllAnimals()
    ]).finally(() => setLoading(false))
  }, [])

  const fetchUserAnimals = async () => {
    if (!user) return
    try {
      const response = await fetch(`${API_BASE}/users/${user.user_id}/animals`)
      const data = await response.json()
      setUserAnimals(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Failed to fetch user animals:', error)
    }
  }

  const fetchAllAnimals = async () => {
    try {
      const response = await fetch(`${API_BASE}/animals`)
      const data = await response.json()
      const animalMap = {}
      if (Array.isArray(data)) {
        data.forEach(animal => {
          animalMap[animal.animal_id] = animal
        })
      }
      setAllAnimals(animalMap)
    } catch (error) {
      console.error('Failed to fetch animals:', error)
    }
  }

  const handleSetProfileAnimal = async (animalId) => {
    if (!user || user.isGuest || updating) return
    
    setUpdating(true)
    
    try {
      const response = await fetch(`${API_BASE}/users/${user.user_id}/set_profile_animal`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ animal_id: animalId })
      })
      
      if (response.ok) {
        // עדכון המשתמש מקומית – שמירת האימוג׳י של החיה לבאנר
        const emoji = animalId ? allAnimals[animalId]?.emoji : null
        updateUserFields({ profile_animal_id: animalId, profile_emoji: emoji })
        // רענון הרשימה כדי לשמר את התצוגה
        await fetchUserAnimals()
      } else {
        alert('שגיאה בעדכון תמונת פרופיל')
      }
    } catch (error) {
      alert('שגיאת רשת')
    } finally {
      setUpdating(false)
    }
  }

  const getCurrentProfileAnimal = () => {
    if (!user?.profile_animal_id || !allAnimals[user.profile_animal_id]) {
      return null
    }
    return allAnimals[user.profile_animal_id]
  }

  if (loading) {
    return (
      <div className={styles.container}>
        <Navbar />
        <div className={styles.loading}>טוען פרופיל...</div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className={styles.container}>
        <Navbar />
        <div className={styles.error}>אנא התחבר לחשבון שלך</div>
      </div>
    )
  }

  const profileAnimal = getCurrentProfileAnimal()

  return (
    <div className={styles.container}>
      <Navbar />
      
      <div className={styles.header}>
        <div className={styles.profilePicture}>
          {profileAnimal ? (
            <div className={styles.currentAnimal}>
              <div className={styles.animalEmoji}>{profileAnimal.emoji}</div>
              <div className={styles.animalName}>{profileAnimal.name}</div>
            </div>
          ) : (
            <div className={styles.noAnimal}>
              <div className={styles.defaultAvatar}>👤</div>
              <div className={styles.noAnimalText}>אין תמונת פרופיל</div>
            </div>
          )}
        </div>
        
        <div className={styles.userInfo}>
          <h1 className={styles.userName}>
            {user.first_name} {user.last_name}
          </h1>
          <div className={styles.userStats}>
            <div className={styles.stat}>
              <span className={styles.statLabel}>כוכבים:</span>
              <span className={styles.statValue}>⭐ {user.stars || 0}</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statLabel}>חיות בבעלות:</span>
              <span className={styles.statValue}>{userAnimals.length}</span>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>החיות שלי 🐾</h2>
        
        {userAnimals.length === 0 ? (
          <div className={styles.empty}>
            <p>עדיין לא קנית חיות.</p>
            <p>לך לחנות כדי לקנות חיות חמודות! 🛍️</p>
          </div>
        ) : (
          <div className={styles.animalsGrid}>
            {userAnimals.map(userAnimal => (
              <div key={userAnimal.animal_id} className={styles.animalCard}>
                <div className={styles.animalEmoji}>{userAnimal.emoji}</div>
                <div className={styles.animalName}>{userAnimal.name}</div>
                <div className={styles.animalCategory}>{userAnimal.category}</div>
                
                {user.profile_animal_id === userAnimal.animal_id ? (
                  <div className={styles.currentProfile}>תמונת פרופיל נוכחית ✓</div>
                ) : (
                  <button
                    className={styles.setProfileButton}
                    onClick={() => handleSetProfileAnimal(userAnimal.animal_id)}
                    disabled={updating}
                  >
                    {updating ? 'מעדכן...' : 'קבע כתמונת פרופיל'}
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {user.profile_animal_id && (
        <div className={styles.section}>
          <button
            className={styles.removeProfileButton}
            onClick={() => handleSetProfileAnimal(null)}
            disabled={updating}
          >
            הסר תמונת פרופיל
          </button>
        </div>
      )}
    </div>
  )
}
