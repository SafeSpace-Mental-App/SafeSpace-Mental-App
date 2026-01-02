import { useEffect, useState } from 'react';
import styles from './modal.module.css';
import form from './forms.module.css';

export default function EntryModal({ open, initial, onClose, onSave }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  // Preload data if editing an existing journal
  useEffect(() => {
    if (open) {
      setTitle(initial?.title || '');
      setContent(initial?.content || '');
    }
  }, [open, initial]);

  if (!open) return null;

  const handleSave = () => {
    if (!title.trim() && !content.trim()) {
      alert('Please write something before saving.');
      return;
    }
    onSave({ title, content });
  };

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <div className={styles.header}>
          <div className="title">{initial ? 'Edit Entry' : 'New Entry'}</div>
          <button className={form.btnGhost} onClick={onClose}>
            Close
          </button>
        </div>

        <input
          className={form.input}
          placeholder="Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />

        <textarea
          className={form.input}
          rows={8}
          placeholder="Write your thoughts..."
          value={content}
          onChange={e => setContent(e.target.value)}
        />

        <div className={styles.footer}>
          <button className={form.btn} onClick={handleSave}>
            {initial ? 'Update Entry' : 'Save Entry'}
          </button>
        </div>
      </div>
    </div>
  );
}
