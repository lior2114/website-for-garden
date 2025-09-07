import styles from './QuestionRenderer.module.css'

export default function QuestionRenderer({ question, onAnswer }) {
  if (!question) return null
  const { type } = question

  if (type === 'identify-animal-by-letter') {
    return (
      <div className={styles.container}>
        <div className={styles.prompt}>{question.prompt}</div>
        <div className={styles.optionsGrid}>
          {question.options.map((opt, idx) => (
            <button key={idx} className={styles.card} onClick={() => onAnswer(idx === question.correctIndex)}>
              <div className={styles.emoji}>{opt.image}</div>
              <div className={styles.caption}>{opt.label}</div>
            </button>
          ))}
        </div>
      </div>
    )
  }

  if (type === 'complete-word-by-picture') {
    return (
      <div className={styles.container}>
        <div className={styles.prompt}>{question.prompt}</div>
        <div className={styles.emojiBig}>{question.image}</div>
        <div className={styles.word}>{question.wordWithBlank}</div>
        <div className={styles.optionsRow}>
          {question.options.map((ch, idx) => (
            <button key={idx} className={styles.choice} onClick={() => onAnswer(idx === question.correctIndex)}>
              {ch}
            </button>
          ))}
        </div>
      </div>
    )
  }

  if (type === 'match-word-to-picture') {
    return (
      <div className={styles.container}>
        <div className={styles.prompt}>{question.prompt}</div>
        <div className={styles.emojiBig}>{question.image}</div>
        <div className={styles.optionsGrid}>
          {question.options.map((w, idx) => (
            <button key={idx} className={styles.card} onClick={() => onAnswer(idx === question.correctIndex)}>
              {w}
            </button>
          ))}
        </div>
      </div>
    )
  }

  return null
}


