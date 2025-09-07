import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react'

const AudioContextReact = createContext(null)

export function AudioProvider({ children }) {
  const [muted, setMuted] = useState(true)
  const audioRef = useRef(null)

  useEffect(() => {
    if (!audioRef.current) {
      const audio = new Audio()
      audio.loop = true
      audio.volume = 0.25
      audioRef.current = audio
    }
    const audio = audioRef.current
    if (muted) {
      audio.pause()
    } else {
      // No default source yet. When a background track is added to public/, set audio.src
      // and handle play() user-gesture requirements.
      // audio.src = '/bg-music.mp3'
      // void audio.play().catch(() => {})
    }
  }, [muted])

  const value = useMemo(
    () => ({
      muted,
      toggle: () => setMuted((m) => !m),
      setMuted,
    }),
    [muted],
  )

  return <AudioContextReact.Provider value={value}>{children}</AudioContextReact.Provider>
}

export function useAudio() {
  const ctx = useContext(AudioContextReact)
  if (!ctx) throw new Error('useAudio must be used within AudioProvider')
  return ctx
}


