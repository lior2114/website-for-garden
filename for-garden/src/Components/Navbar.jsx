import { Link, useNavigate } from 'react-router-dom'
import Logo from './Logo'
import StarCounter from './StarCounter'
import MuteToggle from './MuteToggle'
import { useUser } from '../Contexts/UserContext'
import styles from './Navbar.module.css'

export default function Navbar() {
  const { user, isLoggedIn, logout, loginAsGuest } = useUser()
  const navigate = useNavigate()
  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const profileEmoji = user?.profile_emoji || null
  const profileImageUrl = user?.profile_image_url || null

  return (
    <nav className={styles.container}>
      {/* Avatar fixed to the far right */}
      {isLoggedIn && (
        <div className={styles.bigAvatarWrap}>
          <button className={styles.bigAvatar} onClick={() => navigate('/profile')} title="לצפייה בפרופיל">
            {profileImageUrl ? (
              <img src={profileImageUrl} alt="avatar" />
            ) : profileEmoji ? (
              <span>{profileEmoji}</span>
            ) : (
              <span>🙂</span>
            )}
          </button>
          <div className={styles.userNameLabel}>{(user?.first_name || '') + ' ' + (user?.last_name || '')}</div>
        </div>
      )}

      <div className={styles.sideLeft}>
        {isLoggedIn ? (
          <button className={styles.logoutBtn} onClick={handleLogout}>התנתק</button>
        ) : null}
        <Link className={styles.link} to="/">מסך פתיחה</Link>
        {!isLoggedIn ? (
          <div className={styles.profileBox}>
            <button className={styles.guestBtn} onClick={loginAsGuest}>היכנס כאורח</button>
            <Link className={styles.link} to="/login">התחבר</Link>
          </div>
        ) : (
          <Link className={styles.link} to="/profile">פרופיל 👤</Link>
        )}
        <Link className={styles.link} to="/levels">בחירת רמה</Link>
        <Link className={styles.link} to="/shop">חנות 🛍️</Link>
        <MuteToggle />
      </div>
      <div className={styles.center}>
        <Logo />
      </div>
      <div className={styles.sideRight}>
        <StarCounter />
      </div>
    </nav>
  )
}


