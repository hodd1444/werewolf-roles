import type { CSSProperties } from 'react';
import type { RoleDef } from '../data/roles';
import { useStore } from '../store';
import { RoleIcon } from './RoleIcon';

/** Decide whether a dark or a light ink reads better on a given card colour. */
export function inkFor(hex: string) {
  const h = hex.replace('#', '');
  const n = parseInt(h.length === 3 ? h.replace(/./g, '$&$&') : h, 16);
  const r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
  const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return lum > 0.55 ? '#1d120d' : '#f3e2b0';
}

export function RoleArt({ role, size = 64 }: { role: RoleDef; size?: number }) {
  return (
    <div className="role-art" style={{ '--c': role.color, color: inkFor(role.color) } as CSSProperties}>
      <RoleIcon icon={role.icon} size={size} />
    </div>
  );
}

export function RoleCard({ role, big, onClick }: { role: RoleDef; big?: boolean; onClick?: () => void }) {
  const { name, t } = useStore();
  return (
    <div className={`role-card${big ? ' big' : ''}${onClick ? ' clickable' : ''}`} onClick={onClick}>
      <RoleArt role={role} size={big ? 120 : 44} />
      <div className="role-card-title">{name(role)}</div>
      <div className={`team-badge team-${role.team}`}>{t[`team_${role.team}`]}</div>
    </div>
  );
}

/** Archimedean spiral like the classic card back, drawn procedurally. */
export function spiralPath(turns = 4.5, steps = 260, r0 = 4, r1 = 46) {
  let d = '';
  for (let i = 0; i <= steps; i++) {
    const p = i / steps;
    const a = p * turns * Math.PI * 2;
    const r = r0 + (r1 - r0) * p;
    d += `${i ? 'L' : 'M'}${(50 + Math.cos(a) * r).toFixed(2)} ${(50 + Math.sin(a) * r).toFixed(2)}`;
  }
  return d;
}
const SPIRAL = spiralPath();

export function CardBack({ big }: { big?: boolean }) {
  return (
    <div className={`card-back${big ? ' big' : ''}`}>
      <svg viewBox="0 0 100 100" className="card-back-spiral" aria-hidden>
        <path d={SPIRAL} fill="none" stroke="#8e1b14" strokeWidth="5.2" strokeLinecap="round" />
        <path d={SPIRAL} fill="none" stroke="#5a0f0b" strokeWidth="1.2" strokeLinecap="round" opacity=".5" />
        <g transform="translate(36 34) scale(1.18)" color="#140d0b">
          <path
            d="M3 2.5 7.6 7.4 12 6.3l4.4 1.1L21 2.5l-.9 8.6-3.2 4.8L12.6 21.6 12 21l-.6.6-4.3-5.7-3.2-4.8Z"
            fill="#140d0b"
            stroke="#e9cf8c"
            strokeWidth="1.2"
            strokeLinejoin="round"
          />
          <circle cx="9" cy="11.6" r="1.2" fill="#e04a2a" />
          <circle cx="15" cy="11.6" r="1.2" fill="#e04a2a" />
        </g>
      </svg>
    </div>
  );
}
