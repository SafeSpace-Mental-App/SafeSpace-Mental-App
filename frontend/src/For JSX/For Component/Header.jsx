import styles from './header.module.css';

export default function Header({ greeting, subtitle, right }){
  return (
    <div className={styles.wrap}>
      <div>
        <div className={styles.greet}>{greeting}</div>
        {subtitle && <div className="sub">{subtitle}</div>}
      </div>
      <div className={styles.actions}>{right}</div>
    </div>
  );
}
