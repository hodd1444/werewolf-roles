import type { L } from './roles';

export type RoleCounts = Record<string, number>;

export interface Preset {
  id: string;
  name: L;
  tagline: L;
  build: (n: number) => RoleCounts;
}

export const wolvesFor = (n: number) => (n <= 6 ? 1 : n <= 11 ? 2 : n <= 17 ? 3 : n <= 23 ? 4 : 5);

/** Adds roles from `wanted` (in priority order) as long as `slots` allows; the rest becomes villagers. */
function fill(n: number, wolves: number, wanted: [string, number, number?][], villagerFill = true): RoleCounts {
  const counts: RoleCounts = { werewolf: wolves };
  let left = n - wolves;
  for (const [id, minPlayers, size = 1] of wanted) {
    if (n < minPlayers || left < size) continue;
    counts[id] = (counts[id] ?? 0) + size;
    left -= size;
  }
  if (left > 0) {
    if (villagerFill) counts.villager = left;
    else counts.werewolf += left;
  }
  return counts;
}

export const PRESETS: Preset[] = [
  {
    id: 'starter',
    name: { de: 'Einsteiger', en: 'Starter' },
    tagline: { de: 'Werwölfe, Seherin, Hexe & Jäger', en: 'Werewolves, seer, witch & hunter' },
    build: (n) => fill(n, wolvesFor(n), [['seer', 3], ['witch', 6], ['hunter', 7]]),
  },
  {
    id: 'classic',
    name: { de: 'Klassisch', en: 'Classic' },
    tagline: { de: 'Das komplette Basisspiel', en: 'The complete base game' },
    build: (n) =>
      fill(n, wolvesFor(n), [['seer', 3], ['witch', 5], ['hunter', 6], ['cupid', 7], ['littleGirl', 9], ['casanova', 10]]),
  },
  {
    id: 'silent',
    name: { de: 'Stille Nacht', en: 'Silent Night' },
    tagline: { de: 'Basisspiel mit Silencer & Beschützer', en: 'Base game with Silencer & bodyguard' },
    build: (n) =>
      fill(n, wolvesFor(n), [
        ['seer', 3],
        ['silencer', 5],
        ['witch', 6],
        ['hunter', 7],
        ['guard', 8],
        ['cupid', 9],
        ['littleGirl', 11],
      ]),
  },
  {
    id: 'characters',
    name: { de: 'Düsterwald+', en: 'Darkwood+' },
    tagline: { de: 'Viele Charaktere, wenige Dorfbewohner', en: 'Many characters, few villagers' },
    build: (n) => {
      const w = wolvesFor(n);
      const bigWolf = n >= 12;
      const c = fill(n, bigWolf ? w - 1 : w, [
        ['bigBadWolf', 12],
        ['seer', 3],
        ['witch', 5],
        ['hunter', 6],
        ['cupid', 7],
        ['guard', 8],
        ['fox', 9],
        ['elder', 10],
        ['silencer', 10],
        ['twoSisters', 11, 2],
        ['knight', 13],
        ['villageIdiot', 14],
        ['piper', 15],
        ['wildChild', 16],
        ['bearTamer', 17],
        ['scapegoat', 18],
        ['whiteWerewolf', 19],
        ['devotedServant', 20],
        ['stutteringJudge', 21],
      ]);
      if (c.werewolf <= 0) delete c.werewolf;
      return c;
    },
  },
  {
    id: 'chaos',
    name: { de: 'Chaos', en: 'Chaos' },
    tagline: { de: 'Nur Sonderrollen – kein einziger Dorfbewohner', en: 'Only special roles – not a single villager' },
    build: (n) =>
      fill(
        n,
        wolvesFor(n),
        [
          ['seer', 3],
          ['witch', 3],
          ['hunter', 4],
          ['silencer', 5],
          ['cupid', 6],
          ['guard', 6],
          ['littleGirl', 7],
          ['casanova', 8],
          ['fox', 8],
          ['elder', 8],
          ['villageIdiot', 9],
          ['knight', 9],
          ['raven', 10],
          ['piper', 10],
          ['prince', 11],
          ['bearTamer', 11],
          ['wildChild', 12],
          ['scapegoat', 12],
          ['tanner', 13],
          ['lycan', 13],
          ['angel', 14],
          ['wolfSeer', 14],
          ['stutteringJudge', 15],
          ['devotedServant', 15],
          ['doppelganger', 16],
          ['cursed', 16],
          ['whiteWerewolf', 17],
          ['serialKiller', 18],
          ['arsonist', 19],
          ['actor', 20],
          ['wolfHound', 21],
          ['accursedWolfFather', 22],
          ['bigBadWolf', 23],
          ['twoSisters', 24, 2],
          ['threeBrothers', 26, 3],
        ],
        false,
      ),
  },
];
