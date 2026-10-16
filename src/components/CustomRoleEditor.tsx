import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { TEAM_ORDER, tr, type NightWhen, type RoleDef, type Team } from '../data/roles';
import { useStore } from '../store';
import { Modal } from './Modal';
import { Confirm } from './Confirm';
import { RoleCard } from './Card';
import { CUSTOM_ICON_CHOICES, RoleIcon, type IconKey } from './RoleIcon';

const COLORS = ['#c9a24a', '#8e1b14', '#6b3fa0', '#2f7a5a', '#3f6f8f', '#c2456b', '#d07a3a', '#2e6a8a', '#4a4a5c', '#d8d2c4', '#5e7a2e', '#3a1a1a'];
const POSITIONS = { early: 25, beforeWolves: 38, afterWolves: 58, late: 85 } as const;
type Pos = keyof typeof POSITIONS;

function posFor(order?: number): Pos {
  if (order == null) return 'afterWolves';
  const keys = Object.keys(POSITIONS) as Pos[];
  return keys.reduce((best, k) =>
    Math.abs(POSITIONS[k] - order) < Math.abs(POSITIONS[best] - order) ? k : best, 'afterWolves' as Pos);
}

export function CustomRoleEditor({ role, onClose }: { role: RoleDef | null; onClose: () => void }) {
  const { s, update, t, f } = useStore();
  const [nameV, setName] = useState(role ? tr(role.name, s.lang) : '');
  const [descV, setDesc] = useState(role ? tr(role.desc, s.lang) : '');
  const [team, setTeam] = useState<Team>(role?.team ?? 'village');
  const [icon, setIcon] = useState<IconKey>((role?.icon as IconKey) ?? 'sparkles');
  const [color, setColor] = useState(role?.color ?? COLORS[0]);
  const [wakes, setWakes] = useState(!!role?.night);
  const [when, setWhen] = useState<NightWhen>(role?.night?.when ?? 'every');
  const [pos, setPos] = useState<Pos>(posFor(role?.night?.order));
  const [askDelete, setAskDelete] = useState(false);
  const [nightText, setNightText] = useState(role?.night ? tr(role.night.text, s.lang) : '');

  const draft: RoleDef = {
    id: role?.id ?? `custom_${Date.now().toString(36)}`,
    custom: true,
    name: nameV.trim() || '…',
    desc: descV.trim(),
    team,
    icon,
    color,
    wakesWithWolves: team === 'wolves' ? true : undefined,
    night: wakes
      ? { order: POSITIONS[pos], when, text: nightText.trim() || `${nameV.trim()} …` }
      : undefined,
  };

  const save = () => {
    update((p) => {
      const exists = p.customRoles.some((r) => r.id === draft.id);
      return {
        ...p,
        customRoles: exists ? p.customRoles.map((r) => (r.id === draft.id ? draft : r)) : [...p.customRoles, draft],
      };
    });
    onClose();
  };

  const remove = () => {
    if (!role) return;
    update((p) => {
      const counts = { ...p.counts };
      delete counts[role.id];
      return { ...p, counts, customRoles: p.customRoles.filter((r) => r.id !== role.id) };
    });
    onClose();
  };

  return (
    <Modal onClose={onClose} title={role ? t.editRole : t.newRole}>
      <div className="editor">
        <div className="editor-preview">
          <RoleCard role={draft} />
        </div>
        <label className="field">
          <span>{t.roleName}</span>
          <input value={nameV} onChange={(e) => setName(e.target.value)} maxLength={40} autoFocus />
        </label>
        <label className="field">
          <span>{t.roleDesc}</span>
          <textarea value={descV} onChange={(e) => setDesc(e.target.value)} rows={3} />
        </label>
        <div className="field">
          <span>{t.team}</span>
          <div className="chips">
            {TEAM_ORDER.map((tm) => (
              <button key={tm} className={`chip${team === tm ? ' active' : ''}`} onClick={() => setTeam(tm)}>
                {t[`team_${tm}`]}
              </button>
            ))}
          </div>
        </div>
        <div className="field">
          <span>{t.icon}</span>
          <div className="icon-grid">
            {CUSTOM_ICON_CHOICES.map((k) => (
              <button key={k} className={`icon-choice${icon === k ? ' active' : ''}`} onClick={() => setIcon(k)}>
                <RoleIcon icon={k} size={22} />
              </button>
            ))}
          </div>
        </div>
        <div className="field">
          <span>{t.color}</span>
          <div className="swatches">
            {COLORS.map((c) => (
              <button
                key={c}
                className={`swatch${color === c ? ' active' : ''}`}
                style={{ background: c }}
                onClick={() => setColor(c)}
                aria-label={c}
              />
            ))}
          </div>
        </div>
        <label className="toggle">
          <input type="checkbox" checked={wakes} onChange={(e) => setWakes(e.target.checked)} />
          <span>{t.wakesAtNight}</span>
        </label>
        {wakes && (
          <div className="night-fields">
            <label className="field">
              <span>{t.nightWhen}</span>
              <select value={when} onChange={(e) => setWhen(e.target.value as NightWhen)}>
                {(['every', 'first', 'everyOther', 'notFirst'] as const).map((w) => (
                  <option key={w} value={w}>
                    {t[`when_${w}`]}
                  </option>
                ))}
              </select>
            </label>
            <label className="field">
              <span>{t.nightPos}</span>
              <select value={pos} onChange={(e) => setPos(e.target.value as Pos)}>
                {(Object.keys(POSITIONS) as Pos[]).map((p) => (
                  <option key={p} value={p}>
                    {t[`pos_${p}`]}
                  </option>
                ))}
              </select>
            </label>
            <label className="field">
              <span>{t.nightText}</span>
              <textarea value={nightText} onChange={(e) => setNightText(e.target.value)} rows={2} />
            </label>
          </div>
        )}
        <div className="editor-actions">
          {role && (
            <button className="btn ghost danger" onClick={() => setAskDelete(true)}>
              <Trash2 size={16} /> {t.delete}
            </button>
          )}
          <span className="spacer" />
          <button className="btn ghost" onClick={onClose}>
            {t.cancel}
          </button>
          <button className="btn primary" disabled={!nameV.trim()} onClick={save}>
            {t.save}
          </button>
        </div>
      </div>
      {askDelete && role && (
        <Confirm
          title={t.delete}
          message={f('confirmDelete', { name: tr(role.name, s.lang) })}
          confirmLabel={t.delete}
          onConfirm={remove}
          onClose={() => setAskDelete(false)}
        />
      )}
    </Modal>
  );
}
