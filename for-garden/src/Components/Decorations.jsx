import styles from './Decorations.module.css'

export default function Decorations() {
  return (
    <div className={styles.container} aria-hidden>
      <div className={`${styles.shape} ${styles.one}`} />
      <div className={`${styles.shape} ${styles.two}`} />
      <div className={`${styles.shape} ${styles.three}`} />
    </div>
  )
}


