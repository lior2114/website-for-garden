import { createContext, useCallback, useContext, useMemo, useState } from 'react'

const RewardsContext = createContext(null)

export function RewardsProvider({ children }) {
  const [stars, setStars] = useState(0) // כוכבים כמטבע, לא מוגבלים ל-5

  const addStars = useCallback((amount = 1) => {
    setStars((s) => s + amount)
  }, [])

  const spendStars = useCallback((amount) => {
    setStars((s) => Math.max(0, s - amount))
  }, [])

  const resetStars = useCallback(() => setStars(0), [])

  const value = useMemo(
    () => ({ stars, addStars, spendStars, resetStars, setStars }),
    [stars, addStars, spendStars, resetStars],
  )

  return <RewardsContext.Provider value={value}>{children}</RewardsContext.Provider>
}

export function useRewards() {
  const ctx = useContext(RewardsContext)
  if (!ctx) throw new Error('useRewards must be used within RewardsProvider')
  return ctx
}


