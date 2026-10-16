import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { BUILTIN_MAP, BUILTIN_ROLES, tr, type Lang, type RoleDef } from './data/roles';
import type { RoleCounts } from './data/presets';
import { DICTS, fmt, type Dict } from './i18n';

export type Screen = 'setup' | 'names' | 'reveal' | 'game';

export interface GPlayer {
  name: string;
  roleId: string;
  alive: boolean;
  captain: boolean;
  lover: boolean;
  silenced: boolean;
  /** Casanova sleeps at this player's house tonight */
  host?: boolean;
  prevHost?: boolean;
}

export interface Game {
  players: GPlayer[];
  leftover: string[];
  revealIndex: number;
  revealed: boolean;
  night: number;
  step: number;
  tab: 'overview' | 'night';
  thiefSwap?: { player: number; card: number };
}

export interface AppState {
  lang: Lang;
  screen: Screen;
  playerCount: number;
  counts: RoleCounts;
  names: string[];
  roster: string[];
  customRoles: RoleDef[];
  nightGuide: boolean;
  game: Game | null;
}

const KEY = 'werwolf-app-v1';

const initial: AppState = {
  lang: 'de',
  screen: 'setup',
  playerCount: 8,
  counts: { werewolf: 2, seer: 1, witch: 1, hunter: 1, villager: 3 },
  names: [],
  roster: [],
  customRoles: [],
  nightGuide: true,
  game: null,
};

function load(): AppState {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return { ...initial, ...JSON.parse(raw) };
  } catch {
    /* storage unavailable */
  }
  return initial;
}

interface Ctx {
  s: AppState;
  update: (fn: (s: AppState) => AppState) => void;
  t: Dict;
  f: (key: keyof Dict, vars?: Record<string, string | number>) => string;
  allRoles: RoleDef[];
  role: (id: string) => RoleDef;
  name: (r: RoleDef) => string;
  desc: (r: RoleDef) => string;
}

const StoreCtx = createContext<Ctx>(null!);

const UNKNOWN: RoleDef = { id: '?', name: '?', desc: '', team: 'village', icon: 'sparkles', color: '#555' };

export function StoreProvider({ children }: { children: ReactNode }) {
  const [s, setS] = useState<AppState>(load);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(s));
    } catch {
      /* ignore */
    }
    document.documentElement.lang = s.lang;
  }, [s]);

  const update = useCallback((fn: (s: AppState) => AppState) => setS((prev) => fn(prev)), []);

  const value = useMemo<Ctx>(() => {
    const t = DICTS[s.lang];
    const customMap = Object.fromEntries(s.customRoles.map((r) => [r.id, r]));
    return {
      s,
      update,
      t,
      f: (key, vars) => fmt(t[key], vars),
      allRoles: [...BUILTIN_ROLES, ...s.customRoles],
      role: (id) => BUILTIN_MAP[id] ?? customMap[id] ?? UNKNOWN,
      name: (r) => tr(r.name, s.lang),
      desc: (r) => tr(r.desc, s.lang),
    };
  }, [s, update]);

  return <StoreCtx.Provider value={value}>{children}</StoreCtx.Provider>;
}

export const useStore = () => useContext(StoreCtx);

// ───────── helpers ─────────

export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const buf = new Uint32Array(1);
    crypto.getRandomValues(buf);
    const j = buf[0] % (i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export const totalCards = (counts: RoleCounts) => Object.values(counts).reduce((a, b) => a + b, 0);
export const cardsNeeded = (n: number, counts: RoleCounts) => n + ((counts.thief ?? 0) > 0 ? 2 : 0);

export function deal(names: string[], counts: RoleCounts): Game {
  const deck = shuffle(Object.entries(counts).flatMap(([id, c]) => Array<string>(c).fill(id)));
  return {
    players: names.map((name, i) => ({
      name,
      roleId: deck[i],
      alive: true,
      captain: false,
      lover: false,
      silenced: false,
    })),
    leftover: deck.slice(names.length),
    revealIndex: 0,
    revealed: false,
    night: 1,
    step: 0,
    tab: 'overview',
  };
}
