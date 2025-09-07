import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

const UserContext = createContext(null)

const API_BASE = 'http://localhost:5000'

export function UserProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // טעינת המשתמש מ-localStorage בעת טעינת האפליקציה
  useEffect(() => {
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser))
      } catch (e) {
        localStorage.removeItem('user')
      }
    }
    setLoading(false)
  }, [])

  // שמירת המשתמש ב-localStorage
  const saveUser = useCallback((userData) => {
    setUser(userData)
    localStorage.setItem('user', JSON.stringify(userData))
  }, [])

  // עדכון שדות ספציפיים במשתמש ושמירה
  const updateUserFields = useCallback((partial) => {
    setUser((prev) => {
      const next = { ...(prev || {}), ...(partial || {}) }
      localStorage.setItem('user', JSON.stringify(next))
      return next
    })
  }, [])

  const login = useCallback(async (email, password) => {
    try {
      const response = await fetch(`${API_BASE}/users/login?user_email=${encodeURIComponent(email)}&user_password=${encodeURIComponent(password)}`)
      const data = await response.json()
      
      if (response.ok) {
        saveUser(data)
        return { success: true, data }
      } else {
        return { success: false, error: data.Error || 'Login failed' }
      }
    } catch (error) {
      return { success: false, error: 'Network error' }
    }
  }, [saveUser])

  const register = useCallback(async (firstName, lastName, email, password) => {
    try {
      const response = await fetch(`${API_BASE}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          first_name: firstName,
          last_name: lastName,
          user_email: email,
          user_password: password
        })
      })
      
      const data = await response.json()
      
      if (response.ok) {
        saveUser(data)
        return { success: true, data }
      } else {
        return { success: false, error: data.Error || 'Registration failed' }
      }
    } catch (error) {
      return { success: false, error: 'Network error' }
    }
  }, [saveUser])

  const logout = useCallback(() => {
    setUser(null)
    localStorage.removeItem('user')
  }, [])

  const loginAsGuest = useCallback(() => {
    const guest = {
      user_id: null,
      first_name: 'אורח',
      last_name: '',
      user_email: null,
      stars: 0,
      profile_animal_id: null,
      isGuest: true,
    }
    saveUser(guest)
    return { success: true, data: guest }
  }, [saveUser])

  const updateUserStars = useCallback(async (newStarsAmount) => {
    if (!user) return
    
    // עדכון מקומי
    const updatedUser = { ...user, stars: newStarsAmount }
    saveUser(updatedUser)
    
    // אפשר גם לשלוח לשרת אם רוצים לסנכרן
  }, [user, saveUser])

  const value = useMemo(() => ({
    user,
    loading,
    login,
    register,
    logout,
    loginAsGuest,
    updateUserStars,
    updateUserFields,
    isLoggedIn: !!user
  }), [user, loading, login, register, logout, loginAsGuest, updateUserStars, updateUserFields])

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}

export function useUser() {
  const ctx = useContext(UserContext)
  if (!ctx) throw new Error('useUser must be used within UserProvider')
  return ctx
}
