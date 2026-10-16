import { useMemo, useState } from 'react';
import { ChevronDown, Minus, Pencil, Plus, Search, Sparkles, Trash2, Wand2 } from 'lucide-react';
import { PRESETS, type RoleCounts } from '../data/presets';
import { TEAM_ORDER, type RoleDef, type Team } from '../data/roles';
import { cardsNeeded, totalCards, useStore } from '../store';
import { RoleArt } from '../components/Card';
import { RoleIcon } from '../components/RoleIcon';
import { RoleInfo } from '../components/RoleInfo';
import { CustomRoleEditor } from '../components/CustomRoleEditor';

export function Stepper({
  value,
  onChange,
  min = 0,
  max = 99,
  big,
}: {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  big?: boolean;
}) {
  return (
    <div className={`stepper${big ? ' big' : ''}`}>
      <button onClick={() => onChange(Math.max(min, value - 1))} disabled={value <= min} aria-label="−">
        <Minus size={big ? 22 : 16} />
      </button>
      <span className="stepper-value">{value}</span>
      <button onClick={() => onChange(Math.min(max, value + 1))} disabled={value >= max} aria-label="+">
        <Plus size={big ? 22 : 16} />
      </button>
    </div>
  );
}

function RoleRow({ role, onInfo, onEdit }: { role: RoleDef; onInfo: () => void; onEdit?: () => void }) {
  const { s, update, name, t } = useStore();
  const count = s.counts[role.id] ?? 0;
  const set = (v: number) =>
    update((p) => {
      const counts = { ...p.counts, [role.id]: v };
      if (!v) delete counts[role.id];
      return { ...p, counts };
    });
  return (
    <div className={`role-row${count ? ' selected' : ''}`}>
      <button className="role-row-art" onClick={onInfo} aria-label={t.info}>
        <RoleArt role={role} size={26} />
      </button>
      <button className="role-row-text" onClick={onInfo}>
        <span className="role-row-name">{name(role)}</span>
        <span className={`team-dot team-${role.team}`}>{t[`team_${role.team}`]}</span>
      </button>
      {onEdit && (
        <button className="icon-btn" onClick={onEdit} aria-label={t.editRole}>
          <Pencil size={16} />
        </button>
      )}
      <Stepper value={count} onChange={set} />
    </div>
  );
}

function PresetChips({ counts }: { counts: RoleCounts }) {
  const { role } = useStore();
  return (
    <div className="preset-chips">
      {Object.entries(counts)
        .filter(([, c]) => c > 0)
        .map(([id, c]) => {
          const r = role(id);
          return (
            <span key={id} className="mini-chip" style={{ background: r.color }} title={id}>
              <RoleIcon icon={r.icon} size={12} />
              {c > 1 && <b>{c}</b>}
            </span>
          );
        })}
    </div>
  );
}

export function Setup() {
  const { s, update, t, f, allRoles, name, role } = useStore();
  const [info, setInfo] = useState<RoleDef | null>(null);
  const [editing, setEditing] = useState<RoleDef | 'new' | null>(null);
  const [query, setQuery] = useState('');
  const [team, setTeam] = useState<Team | 'all'>('all');
  const extras = allRoles.filter((r) => !r.base && !r.custom);
  const custom = allRoles.filter((r) => r.custom);
  const extrasSelected = extras.reduce((a, r) => a + (s.counts[r.id] ?? 0), 0);
  const [open, setOpen] = useState(extrasSelected > 0);

  const have = totalCards(s.counts);
  const need = cardsNeeded(s.playerCount, s.counts);
  const diff = have - need;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return extras
      .filter((r) => team === 'all' || r.team === team)
      .filter((r) => !q || name(r).toLowerCase().includes(q))
      .sort((a, b) => TEAM_ORDER.indexOf(a.team) - TEAM_ORDER.indexOf(b.team));
  }, [extras, query, team, name]);

  const presets = useMemo(() => PRESETS.map((p) => ({ p, counts: p.build(s.playerCount) })), [s.playerCount]);

  const fill = () =>
    update((p) => {
      const missing = need - have;
      if (missing <= 0) return p;
      return { ...p, counts: { ...p.counts, villager: (p.counts.villager ?? 0) + missing } };
    });

  const selected = Object.entries(s.counts).filter(([, c]) => c > 0);

  return (
    <div className="setup">
      <section className="panel count-panel">
        <h2 className="section-title">{t.playerCount}</h2>
        <Stepper
          big
          value={s.playerCount}
          min={3}
          max={40}
          onChange={(v) => update((p) => ({ ...p, playerCount: v }))}
        />
        <label className="switch-row">
          <span>
            <b>{t.nightGuideToggle}</b>
            <small>{t.nightGuideHint}</small>
          </span>
          <input
            type="checkbox"
            className="switch"
            checked={s.nightGuide}
            onChange={(e) => update((p) => ({ ...p, nightGuide: e.target.checked }))}
          />
        </label>
      </section>

      <section>
        <h2 className="section-title">
          <Wand2 size={18} /> {t.presets}
        </h2>
        <p className="hint">{f('presetsHint', { n: s.playerCount })}</p>
        <div className="presets">
          {presets.map(({ p, counts }) => (
            <button
              key={p.id}
              className="preset"
              onClick={() => update((prev) => ({ ...prev, counts }))}
            >
              <span className="preset-name">{p.name[s.lang]}</span>
              <span className="preset-tag">{p.tagline[s.lang]}</span>
              <PresetChips counts={counts} />
            </button>
          ))}
        </div>
      </section>

      <section>
        <h2 className="section-title">{t.baseGame}</h2>
        <div className="role-list">
          {allRoles
            .filter((r) => r.base)
            .map((r) => (
              <RoleRow key={r.id} role={r} onInfo={() => setInfo(r)} />
            ))}
        </div>
        <p className="hint captain-hint">
          <RoleIcon icon="captain" size={14} /> <b>{t.captain}:</b> {t.captainHint}
        </p>
      </section>

      <section>
        <button className={`collapse-head${open ? ' open' : ''}`} onClick={() => setOpen(!open)}>
          <span className="section-title">
            <Sparkles size={18} /> {t.expansions}
          </span>
          <span className="collapse-meta">
            {extrasSelected > 0 && <span className="badge">{extrasSelected}</span>}
            <span className="muted">{extras.length}</span>
            <ChevronDown size={20} className="chev" />
          </span>
        </button>
        {open && (
          <div className="collapse-body">
            <div className="search">
              <Search size={16} />
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={t.search} />
            </div>
            <div className="chips">
              {(['all', ...TEAM_ORDER] as const).map((tm) => (
                <button key={tm} className={`chip${team === tm ? ' active' : ''}`} onClick={() => setTeam(tm)}>
                  {tm === 'all' ? t.all : t[`team_${tm}`]}
                </button>
              ))}
            </div>
            <div className="role-list">
              {filtered.map((r) => (
                <RoleRow key={r.id} role={r} onInfo={() => setInfo(r)} />
              ))}
              {!filtered.length && <p className="hint">{t.noResults}</p>}
            </div>
          </div>
        )}
      </section>

      <section>
        <h2 className="section-title">
          <Pencil size={18} /> {t.customRoles}
        </h2>
        <p className="hint">{t.customHint}</p>
        <div className="role-list">
          {custom.map((r) => (
            <RoleRow key={r.id} role={r} onInfo={() => setInfo(r)} onEdit={() => setEditing(r)} />
          ))}
        </div>
        <button className="btn ghost wide" onClick={() => setEditing('new')}>
          <Plus size={18} /> {t.newRole}
        </button>
      </section>

      <div className="bottom-bar">
        <div className="bar-inner">
          <div className="bar-status">
            <div className={`cards-count ${diff === 0 && have > 0 ? 'ok' : 'warn'}`}>
              {f('cardsNeeded', { have, need })}
            </div>
            <div className="bar-sub">
              {diff === 0 ? t.ready : diff > 0 ? f('tooMany', { x: diff }) : f('tooFew', { x: -diff })}
              {(s.counts.thief ?? 0) > 0 && <span className="muted"> · {t.thiefHint}</span>}
            </div>
            {selected.length > 0 && (
              <div className="bar-chips">
                {selected.map(([id, c]) => (
                  <span key={id} className="sel-chip">
                    {c}× {name(role(id))}
                  </span>
                ))}
              </div>
            )}
          </div>
          <div className="bar-actions">
            {diff < 0 && (
              <button className="btn ghost small" onClick={fill}>
                {t.fillVillagers}
              </button>
            )}
            {have > 0 && diff !== 0 && (
              <button className="btn ghost small" onClick={() => update((p) => ({ ...p, counts: {} }))}>
                <Trash2 size={14} /> {t.clearRoles}
              </button>
            )}
            <button
              className="btn primary"
              disabled={diff !== 0 || have === 0}
              onClick={() => update((p) => ({ ...p, screen: 'names' }))}
            >
              {t.next}
            </button>
          </div>
        </div>
      </div>

      {info && <RoleInfo role={info} onClose={() => setInfo(null)} />}
      {editing && (
        <CustomRoleEditor role={editing === 'new' ? null : editing} onClose={() => setEditing(null)} />
      )}
    </div>
  );
}
