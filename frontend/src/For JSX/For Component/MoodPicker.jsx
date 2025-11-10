import styles from './forms.module.css';

const moods = [
  { key:'very_low', emoji:'😡', label:'Very Low' },
  { key:'low',      emoji:'😞', label:'Low' },
  { key:'okay',     emoji:'🙂', label:'Okay' },
  { key:'good',     emoji:'😎', label:'Good' },
  { key:'great',    emoji:'🥰', label:'Great' },
];

export default function MoodPicker({ value, onChange }){
  return (
    <div className={styles.moodRow}>
      {moods.map(m=>(
        <button
          key={m.key}
          onClick={()=> onChange(m.key)}
          className={`${styles.moodBtn} ${value===m.key ? styles.moodActive:''}`}
          aria-label={m.label}
        >{m.emoji}</button>
      ))}
      <button className={styles.moodBtn} onClick={()=> onChange('custom')}>＋</button>
    </div>
  );
}
