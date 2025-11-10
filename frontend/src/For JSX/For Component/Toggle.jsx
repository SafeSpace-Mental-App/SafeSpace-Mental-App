import styles from './forms.module.css';

export default function Toggle({ label, description, checked, onChange }){
  return (
    <div className={styles.toggle}>
      <div>
        <div className="title">{label}</div>
        {description && <div className="sub">{description}</div>}
      </div>
      <div
        role="switch"
        aria-checked={checked}
        className={styles.switch}
        data-on={checked ? 'true':'false'}
        onClick={()=> onChange(!checked)}
      />
    </div>
  );
}
