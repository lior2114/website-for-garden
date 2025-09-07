import { useEffect, useState } from 'react'
import { useUser } from '../Contexts/UserContext'
import { useRewards } from '../Contexts/RewardsContext'
import Navbar from '../Components/Navbar'
import styles from './ShopPage.module.css'

const API_BASE = 'http://localhost:5000'

export default function ShopPage() {
  const { user, isLoggedIn, updateUserStars } = useUser()
  const { stars, spendStars, setStars } = useRewards()
  const [animals, setAnimals] = useState([])
  const [userAnimals, setUserAnimals] = useState([])
  const [loading, setLoading] = useState(true)
  const [purchasing, setPurchasing] = useState(null)
  const [modal, setModal] = useState({ open: false, type: 'info', message: '' })

  // derive visible balance: DB user stars if logged-in, else local rewards
  const visibleStars = isLoggedIn && typeof user?.stars === 'number' ? user.stars : stars

  useEffect(() => {
    Promise.all([
      fetchAnimals(),
      fetchUserAnimals(),
      refreshUserStars(),
    ]).finally(() => setLoading(false))
  }, [user?.user_id])

  const refreshUserStars = async () => {
    if (!isLoggedIn || !user?.user_id) return
    try {
      const res = await fetch(`${API_BASE}/users/${user.user_id}`)
      if (!res.ok) return
      const data = await res.json()
      if (typeof data?.stars === 'number') {
        updateUserStars(data.stars)
        setStars(data.stars)
      }
    } catch (err) {
      // silent
    }
  }

  const fetchAnimals = async () => {
    try {
      const response = await fetch(`${API_BASE}/animals`)
      const data = await response.json()
      setAnimals(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Failed to fetch animals:', error)
    }
  }

  const fetchUserAnimals = async () => {
    if (!user?.user_id) return
    try {
      const response = await fetch(`${API_BASE}/users/${user.user_id}/animals`)
      const data = await response.json()
      setUserAnimals(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Failed to fetch user animals:', error)
    }
  }

  const handlePurchase = async (animal) => {
    if (!user || purchasing) return
    if (user.isGuest) {
      setModal({ open: true, type: 'error', message: 'כדי לקנות חיות יש להתחבר או להירשם.' })
      return
    }
    if (visibleStars < animal.price) {
      setModal({ open: true, type: 'error', message: 'אין מספיק כוכבים לרכישה הזו.' })
      return
    }
    
    setPurchasing(animal.animal_id)
    
    try {
      const response = await fetch(`${API_BASE}/users/${user.user_id}/purchase/${animal.animal_id}`, {
        method: 'POST'
      })
      
      const data = await response.json()
      if (response.ok) {
        await fetchUserAnimals()
        // Update balances consistently
        if (typeof data?.remaining_stars === 'number') {
          updateUserStars(data.remaining_stars)
          setStars(data.remaining_stars)
        } else {
          await refreshUserStars()
        }
        setModal({ open: true, type: 'success', message: `קנית את ${animal.name}! 🎉` })
      } else {
        setModal({ open: true, type: 'error', message: data.Error || 'שגיאה בקנייה' })
      }
    } catch (error) {
      setModal({ open: true, type: 'error', message: 'שגיאת רשת' })
    } finally {
      setPurchasing(null)
    }
  }

  const isOwned = (animalId) => {
    return userAnimals.some(ua => ua.animal_id === animalId)
  }

  const groupedAnimals = animals.reduce((groups, animal) => {
    const category = animal.category
    if (!groups[category]) groups[category] = []
    groups[category].push(animal)
    return groups
  }, {})

  if (loading) {
    return (
      <div className={styles.container}>
        <Navbar />
        <div className={styles.loading}>טוען חנות...</div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <Navbar />
      {modal.open && (
        <div className={`${styles.modal} ${styles[modal.type]}`} onClick={() => setModal({ open: false })}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalMessage}>{modal.message}</div>
            <button className={styles.closeBtn} onClick={() => setModal({ open: false })}>סגור</button>
          </div>
        </div>
      )}
      
      <div className={styles.header}>
        <h1 className={styles.title}>🛍️ חנות החיות 🛍️</h1>
        <div className={styles.balance}>
          יש לך ⭐ {visibleStars} כוכבים
        </div>
      </div>

      <div className={styles.categories}>
        {Object.entries(groupedAnimals).map(([category, categoryAnimals]) => (
          <div key={category} className={styles.category}>
            <h2 className={styles.categoryTitle}>{category}</h2>
            <div className={styles.animalGrid}>
              {categoryAnimals.map(animal => (
                <div key={animal.animal_id} className={styles.animalCard}>
                  <div className={styles.animalEmoji}>{animal.emoji}</div>
                  <div className={styles.animalName}>{animal.name}</div>
                  <div className={styles.animalPrice}>⭐ {animal.price}</div>
                  
                  {isOwned(animal.animal_id) ? (
                    <div className={styles.owned}>יש לך! ✓</div>
                  ) : (
                    <button
                      className={`${styles.buyButton} ${
                        visibleStars < animal.price || purchasing ? styles.disabled : ''
                      }`}
                      onClick={() => handlePurchase(animal)}
                      disabled={visibleStars < animal.price || purchasing === animal.animal_id}
                    >
                      {purchasing === animal.animal_id ? 'קונה...' : 
                       visibleStars < animal.price ? 'לא מספיק כוכבים' : 'קנה'}
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
