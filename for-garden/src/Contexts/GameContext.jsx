import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { getQuestionsForLevel } from '../api/questions'

const QUESTION_TYPES = [
  'identify-animal-by-letter',
  'complete-word-by-picture',
  'match-word-to-picture',
  'find-letter',
  'letter-puzzle',
  'memory',
  'order-the-word',
]

const QUESTIONS_PER_TYPE_BEFORE_ROTATE = 2

const GameContext = createContext(null)

export function GameProvider({ children }) {
  const [level, setLevel] = useState('easy')
  const [index, setIndex] = useState(0)
  const questions = useMemo(() => getQuestionsForLevel(level), [level])
  const currentQuestion = questions[index]

  const resetGameFlow = useCallback(() => {
    setIndex(0)
  }, [])

  const nextQuestion = useCallback(() => {
    setIndex((i) => (i + 1) % Math.max(questions.length, 1))
  }, [])

  const value = useMemo(
    () => ({
      level,
      setLevel,
      questions,
      index,
      currentQuestion,
      nextQuestion,
      resetGameFlow,
    }),
    [level, questions, index, currentQuestion, nextQuestion, resetGameFlow],
  )

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>
}

export function useGame() {
  const ctx = useContext(GameContext)
  if (!ctx) throw new Error('useGame must be used within GameProvider')
  return ctx
}


