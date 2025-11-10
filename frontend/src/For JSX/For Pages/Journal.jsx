import { useMemo, useState } from 'react';
import Header from '../For Component/Header.jsx';
import Navbar from '../../For TSX/components/Common Component/Navbar';
import JournalCard from '../For Component/JournalCard.jsx';
import PromptCard from '../For Component/PromptCard.jsx';
import EntryModal from '../For Component/EntryModal.jsx';
import { useApi } from '../lib/useApi.js';
import { api } from '../lib/api.js';
import form from '../For Component/forms.module.css';
import './journal.css'; // <-- NEW

function toArray(x) {
  if (!x) return [];
  if (Array.isArray(x)) return x;
  if (Array.isArray(x.items)) return x.items;
  if (Array.isArray(x.journals)) return x.journals;
  if (x.data) return toArray(x.data);
  return [];
}
function getId(it) {
  return it?.id ?? it?._id ?? it?.uuid ?? it?.journalId ?? null;
}

export default function Journal() {
  const list = useApi('/journals/my');

  const [query, setQuery] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const rawItems = useMemo(() => toArray(list.data), [list.data]);

  const totals = useMemo(() => {
    const d = list.data || {};
    const entries =
      d.totalEntries ??
      (Array.isArray(d.journals) ? d.journals.length : rawItems.length);

    const words =
      d.totalWords ??
      (Array.isArray(d.journals)
        ? d.journals.reduce((sum, j) => {
            const text = (j.content || j.text || '').trim();
            return sum + (text ? text.split(/\s+/).filter(Boolean).length : 0);
          }, 0)
        : rawItems.reduce((sum, j) => {
            const text = (j.content || j.text || '').trim();
            return sum + (text ? text.split(/\s+/).filter(Boolean).length : 0);
          }, 0));

    return { entries, words };
  }, [list.data, rawItems]);

  const items = useMemo(() => {
    if (!query.trim()) return rawItems;
    const q = query.toLowerCase();
    return rawItems.filter((it) => {
      const title = (it.title || '').toLowerCase();
      const text  = (it.content || it.text || '').toLowerCase();
      const tags  = Array.isArray(it.tags) ? it.tags.join(' ').toLowerCase() : '';
      return title.includes(q) || text.includes(q) || tags.includes(q);
    });
  }, [rawItems, query]);

  async function createOrUpdateEntry(payload) {
    if (!editing) {
      await api.request('/journals/create', { method: 'POST', body: payload });
    } else {
      const id = getId(editing);
      if (!id) { console.error('Missing journal id on edit'); return; }
      await api.request(`/journals/edit/${id}`, { method: 'POST', body: payload });
    }
    setModalOpen(false);
    setEditing(null);
    list.reload();
  }

  async function remove(idLike) {
    const id = getId(idLike) ?? idLike;
    if (!id) { console.error('Missing journal id on delete'); return; }
    await api.request(`/journals/delete/${id}`, { method: 'DELETE' });
    list.reload();
  }

  function setEditingAndOpen(item) {
    setEditing(item);
    setModalOpen(true);
  }

  return (
    <div className="journal-container">
      <Header
        greeting="Personal Journal"
        subtitle="Your private space for thoughts and reflections"
      />

      {/* Stats */}
      <section className="tiles">
        <Tile label="Journal Entries" value={totals.entries ?? '—'} />
        <Tile label="Words Written"  value={totals.words ?? '—'} />
      </section>

      {/* Search + Actions */}
      <section className="toolbar">
        <div className={`searchbar ${form.search}`}>
          <input
            className={form.input}
            placeholder="Search posts or topics…"
            value={query}
            onChange={e => setQuery(e.target.value)}
            aria-label="Search journal"
          />
          <button className={form.btnGhost} onClick={() => list.reload()}>Refresh</button>
          <button
            className={`${form.btn} new-entry-btn`}
            onClick={() => { setEditing(null); setModalOpen(true); }}
          >
            New Entry
          </button>
        </div>
      </section>

      {/* States & List */}
      {list.loading && <div className="state">Loading entries…</div>}
      {!list.loading && items.length === 0 && <div className="state">No entries yet.</div>}

      <section className="cards">
        {items.map((item) => {
          const id = getId(item) || Math.random().toString(36).slice(2);
          return (
            <JournalCard
              key={id}
              item={item}
              onEdit={setEditingAndOpen}
              onDelete={() => remove(item)}
            />
          );
        })}
      </section>

      {/* Optional prompt area
      <section className="prompt-area">
        <PromptCard onStart={() => { setEditing(null); setModalOpen(true); }} />
      </section>
      */}

      <EntryModal
        open={modalOpen || !!editing}
        initial={editing}
        onClose={() => { setModalOpen(false); setEditing(null); }}
        onSave={createOrUpdateEntry}
      />

      {/* Sticky mobile CTA mirrors New Entry */}
      <button
        className="fab-new-entry"
        aria-label="Create new entry"
        onClick={() => { setEditing(null); setModalOpen(true); }}
      >
        +
      </button>

      <Navbar />
    </div>
  );
}

function Tile({ label, value }) {
  return (
    <div className="tile">
      <div className="tile-value">{value}</div>
      <div className="tile-label">{label}</div>
    </div>
  );
}
