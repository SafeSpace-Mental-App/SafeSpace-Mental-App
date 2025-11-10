import styles from './cards.module.css';

export default function PromptCard({ prompt, onStart }){
  return (
    <div className={styles.prompt}>
      <div className="title">Today's Writing Prompt</div>
      <div className="sub">{prompt}</div>
      <button className={styles.cta} onClick={onStart}>Start Writing</button>
    </div>
  );
}
