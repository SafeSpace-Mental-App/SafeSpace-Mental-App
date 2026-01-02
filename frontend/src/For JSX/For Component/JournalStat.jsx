import styles from './cards.module.css';
export default function JourneyStat({ label, value }){
  return (
    <div className={styles.stat}>
      <div className={styles.statValue}>{value}</div>
      <div className={styles.statLabel}>{label}</div>
    </div>
  );
}
