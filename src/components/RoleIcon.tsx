import {
  Axe,
  BedDouble,
  Biohazard,
  Bird,
  Copy,
  Crosshair,
  Crown,
  Dog,
  Drama,
  Eye,
  Feather,
  Flame,
  FlaskConical,
  Footprints,
  Frown,
  Gavel,
  Gem,
  Ghost,
  HandHelping,
  Heart,
  Hourglass,
  House,
  Key,
  Laugh,
  MoonStar,
  Music,
  PawPrint,
  Scale,
  ScanEye,
  Search,
  Shield,
  Skull,
  Sparkles,
  Star,
  Sun,
  Sword,
  Users,
  VenetianMask,
  VolumeX,
  Wheat,
  type LucideIcon,
} from 'lucide-react';

/** Hand-drawn wolf head – the heart of the game. */
function WolfHead({ size = 24, eye, extra }: { size?: number; eye?: boolean; extra?: React.ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.3}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 2.5 7.6 7.4 12 6.3l4.4 1.1L21 2.5l-.9 8.6-3.2 4.8L12.6 21.6 12 21l-.6.6-4.3-5.7-3.2-4.8Z" fill="currentColor" fillOpacity={0.22} />
      {eye ? (
        <>
          <circle cx="9" cy="11.6" r="1.1" fill="currentColor" />
          <circle cx="15" cy="11.6" r="1.1" fill="currentColor" />
        </>
      ) : (
        <path d="m7.9 11.2 2.2 1.2m6-1.2-2.2 1.2" />
      )}
      <path d="M10.6 17.4 12 18.3l1.4-.9" />
      {extra}
    </svg>
  );
}

const custom = {
  wolf: (s: number) => <WolfHead size={s} />,
  whiteWolf: (s: number) => <WolfHead size={s} eye />,
  bigBadWolf: (s: number) => (
    <WolfHead size={s} extra={<path d="M9.3 14.6l.8 1.6.8-1.2m2.2 0 .8 1.2.8-1.6" strokeWidth={1.4} />} />
  ),
  wolfFather: (s: number) => (
    <WolfHead size={s} extra={<path d="M12 8.6c-.9 1.2-1.3 1.9-1.3 2.4a1.3 1.3 0 0 0 2.6 0c0-.5-.4-1.2-1.3-2.4Z" fill="currentColor" strokeWidth={1} />} />
  ),
  wolfSeer: (s: number) => (
    <WolfHead size={s} eye extra={<path d="M10.3 9.1Q12 7.9 13.7 9.1Q12 10.3 10.3 9.1Z" fill="currentColor" strokeWidth={1} />} />
  ),
};

const lucide: Record<string, LucideIcon> = {
  villager: House,
  seer: Eye,
  witch: FlaskConical,
  hunter: Crosshair,
  cupid: Heart,
  littleGirl: ScanEye,
  thief: VenetianMask,
  casanova: BedDouble,
  captain: Star,
  silencer: VolumeX,
  guard: Shield,
  elder: Hourglass,
  scapegoat: Scale,
  idiot: Laugh,
  knight: Sword,
  fox: Search,
  bear: PawPrint,
  sisters: Users,
  brothers: Users,
  judge: Gavel,
  servant: HandHelping,
  actor: Drama,
  raven: Bird,
  prince: Crown,
  lycan: MoonStar,
  cursed: Biohazard,
  wildChild: Footprints,
  wolfHound: Dog,
  doppelganger: Copy,
  piper: Music,
  angel: Feather,
  serialKiller: Axe,
  arsonist: Flame,
  tanner: Frown,
  ghost: Ghost,
  skull: Skull,
  gem: Gem,
  key: Key,
  sun: Sun,
  sparkles: Sparkles,
  wheat: Wheat,
};

export type IconKey = keyof typeof custom | keyof typeof lucide;

/** Icons offered for custom roles */
export const CUSTOM_ICON_CHOICES: IconKey[] = [
  'villager', 'wolf', 'seer', 'witch', 'hunter', 'cupid', 'guard', 'silencer', 'knight', 'thief', 'prince',
  'raven', 'fox', 'bear', 'piper', 'actor', 'judge', 'angel', 'arsonist', 'serialKiller', 'ghost', 'skull',
  'gem', 'key', 'sun', 'sparkles', 'wheat', 'lycan', 'cursed', 'elder', 'idiot', 'doppelganger',
];

export function RoleIcon({ icon, size = 24 }: { icon: IconKey | string; size?: number }) {
  if (icon in custom) return custom[icon as keyof typeof custom](size);
  const Cmp = lucide[icon] ?? Sparkles;
  return <Cmp size={size} strokeWidth={2.3} />;
}
