import { useEffect, useRef } from 'react';
import { ArrowLeft, Eraser, UserPlus, X } from 'lucide-react';
import { deal, useStore } from '../store';

export function Names() {
  const { s, update, t, f } = useStore();
  const n = s.playerCount;
  const names = Array.from({ length: n }, (_, i) => s.names[i] ?? '');
  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  // keep stored list in sync with player count (but remember extra names for later)
  useEffect(() => {
    if (s.names.length < n) update((p) => ({ ...p, names: [...p.names, ...Array(n - p.names.length).fill('')] }));
  }, [n, s.names.length, update]);

  const setName = (i: number, v: string) =>
    update((p) => {
      const next = [...p.names];
      while (next.length < n) next.push('');
      next[i] = v;
      return { ...p, names: next };
    });

  const norm = (v: string) => v.trim().toLowerCase();
  const used = new Set(names.map(norm).filter(Boolean));
  const dupes = new Set(names.map(norm).filter((v, i, a) => v && a.indexOf(v) !== i));
  const available = s.roster.filter((r) => !used.has(norm(r)));
  const valid = names.every((v) => v.trim()) && dupes.size === 0;

  const insert = (name: string) => {
    const i = names.findIndex((v) => !v.trim());
    if (i >= 0) setName(i, name);
  };

  const insertAll = () =>
    update((p) => {
      const next = [...p.names];
      while (next.length < n) next.push('');
      const queue = [...available];
      for (let i = 0; i < n && queue.length; i++) if (!next[i]?.trim()) next[i] = queue.shift()!;
      return { ...p, names: next };
    });

  const go = () => {
    const clean = names.map((v) => v.trim());
    update((p) => {
      const known = new Set(p.roster.map(norm));
      const roster = [...p.roster, ...clean.filter((v) => !known.has(norm(v)))];
      return { ...p, names: clean, roster, game: deal(clean, p.counts), screen: 'reveal' };
    });
  };

  return (
    <div className="names">
      <h1 className="screen-title">{t.enterNames}</h1>
      <p className="hint">{t.enterNamesHint}</p>

      {available.length > 0 && (
        <section className="panel">
          <div className="roster-head">
            <h2 className="section-title small">
              <UserPlus size={16} /> {t.savedPlayers} <span className="muted">· {t.savedPlayersHint}</span>
            </h2>
            <button className="btn ghost small" onClick={insertAll} disabled={names.every((v) => v.trim())}>
              {t.insertAll}
            </button>
          </div>
          <div className="roster">
            {available.map((r) => (
              <span key={r} className="roster-chip">
                <button onClick={() => insert(r)} disabled={names.every((v) => v.trim())}>
                  {r}
                </button>
                <button
                  className="roster-x"
                  aria-label={t.removeSaved}
                  onClick={() => update((p) => ({ ...p, roster: p.roster.filter((x) => x !== r) }))}
                >
                  <X size={12} />
                </button>
              </span>
            ))}
          </div>
        </section>
      )}

      <div className="names-tools">
        <button
          className="btn ghost small"
          onClick={() => update((p) => ({ ...p, names: Array(n).fill('') }))}
          disabled={names.every((v) => !v)}
        >
          <Eraser size={14} /> {t.clearNames}
        </button>
      </div>
      <div className="name-list">
        {names.map((v, i) => (
          <label key={i} className={`name-input${dupes.has(norm(v)) ? ' error' : ''}`}>
            <span className="seat">{i + 1}</span>
            <input
              ref={(el) => (inputs.current[i] = el)}
              value={v}
              placeholder={f('playerN', { n: i + 1 })}
              onChange={(e) => setName(i, e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && inputs.current[i + 1]?.focus()}
              enterKeyHint={i < n - 1 ? 'next' : 'done'}
              autoComplete="off"
              autoCapitalize="words"
            />
            {dupes.has(norm(v)) && <span className="err">{t.duplicate}</span>}
            {v && (
              <button className="icon-btn" onClick={() => setName(i, '')} aria-label={t.clearNames}>
                <X size={16} />
              </button>
            )}
          </label>
        ))}
      </div>

      <div className="bottom-bar">
        <div className="bar-inner">
          <button className="btn ghost" onClick={() => update((p) => ({ ...p, screen: 'setup' }))}>
            <ArrowLeft size={18} /> {t.back}
          </button>
          <span className="spacer" />
          <button className="btn primary" disabled={!valid} onClick={go}>
            {t.dealCards}
          </button>
        </div>
      </div>
    </div>
  );
}
