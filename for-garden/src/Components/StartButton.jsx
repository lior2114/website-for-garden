import styles from './StartButton.module.css'

export default function StartButton({ children, onClick }) {
  return (
    <button className={styles.container} onClick={onClick}>
      {children}
    </button>
  )
}


