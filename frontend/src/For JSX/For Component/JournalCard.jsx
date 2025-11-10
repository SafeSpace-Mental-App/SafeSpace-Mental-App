import styles from './list.module.css';

export default function JournalCard({ item, onEdit, onDelete }){
  return (
    <div className={styles.item}>
      <div className={styles.meta}>{item.relativeTime} • {item.time}</div>
      <div className={styles.title}>{item.title}</div>
      <div className={styles.text}>{item.body}</div>
      <div className={styles.tags}>
        {item.tags?.map(t => <span key={t} className="badge">{t}</span>)}
      </div>
      <div className={styles.actions}>
        <button className={styles.danger} onClick={()=> onDelete(item.id)}>Delete</button>
        <button onClick={()=> onEdit(item)}>Edit</button>
      </div>
    </div>
  );
}
