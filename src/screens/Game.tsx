import { useState } from 'react';
import {
  BedDouble,
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff,
  Heart,
  Moon,
  RotateCcw,
  Settings2,
  Skull,
  Star,
  Sun,
  Users,
  VolumeX,
} from 'lucide-react';
import { tr, type RoleDef } from '../data/roles';
import { deal, useStore, type Game, type GPlayer } from '../store';
import { RoleArt, RoleCard } from '../components/Card';
import { RoleInfo } from '../components/RoleInfo';
import { Confirm } from '../components/Confirm';

type Step = { kind: 'sleep' } | { kind: 'role'; role: RoleDef; holders: number[] } | { kind: 'wake' };

function activeTonight(when: string, night: number) {
  if (when === 'first') return night === 1;
  if (when === 'everyOther') return night % 2 === 0;
  if (when === 'notFirst') return night > 1;
  return true;
}

function buildSteps(g: Game, role: (id: string) => RoleDef): Step[] {
  const ids = new Set(g.players.map((p) => p.roleId));
  if (g.thiefSwap) ids.add('thief');
  if (g.players.some((p) => role(p.roleId).wakesWithWolves)) ids.add('werewolf');
  const roles = [...ids]
    .map(role)
    .filter((r) => r.night && activeTonight(r.night.when, g.night))
    .sort((a, b) => a.night!.order - b.night!.order);
  const holdersOf = (r: RoleDef) =>
    g.players
      .map((p, i) => ({ p, i }))
      .filter(({ p, i }) => {
        if (r.id === 'werewolf') return !!role(p.roleId).wakesWithWolves;
        if (r.id === 'thief') return p.roleId === 'thief' || g.thiefSwap?.player === i;
        return p.roleId === r.id;
      })
      .map(({ i }) => i);
  return [{ kind: 'sleep' }, ...roles.map((r) => ({ kind: 'role' as const, role: r, holders: holdersOf(r) })), { kind: 'wake' }];
}

function swapThief(g: Game, cardIdx: number | null): Game {
  const players = g.players.map((p) => ({ ...p }));
  const leftover = [...g.leftover];
  if (g.thiefSwap) {
    const { player, card } = g.thiefSwap;
    leftover[card] = players[player].roleId;
    players[player].roleId = 'thief';
  }
  if (cardIdx == null) return { ...g, players, leftover, thiefSwap: undefined };
  const pi = players.findIndex((p) => p.roleId === 'thief');
  if (pi < 0) return { ...g, players, leftover, thiefSwap: undefined };
  players[pi].roleId = leftover[cardIdx];
  leftover[cardIdx] = 'thief';
  return { ...g, players, leftover, thiefSwap: { player: pi, card: cardIdx } };
}

export function GameScreen() {
  const { s, update, t } = useStore();
  const g = s.game!;
  const setTab = (tab: Game['tab']) => update((p) => ({ ...p, game: { ...p.game!, tab } }));
  if (!s.nightGuide) {
    return (
      <div className="game">
        <Overview />
      </div>
    );
  }
  return (
    <div className="game">
      <div className="tabs">
        <button className={g.tab === 'night' ? 'active' : ''} onClick={() => setTab('night')}>
          <Moon size={16} /> {t.nightGuide}
        </button>
        <button className={g.tab === 'overview' ? 'active' : ''} onClick={() => setTab('overview')}>
          <Users size={16} /> {t.overview}
        </button>
      </div>
      {g.tab === 'overview' ? <Overview /> : <NightGuide />}
    </div>
  );
}

function StatusToggles({ p, i }: { p: GPlayer; i: number }) {
  const { update, t } = useStore();
  const toggle = (key: 'alive' | 'captain' | 'lover' | 'silenced') =>
    update((s) => {
      const players = s.game!.players.map((x, j) => {
        if (key === 'captain' && j !== i) return { ...x, captain: false };
        return j === i ? { ...x, [key]: !x[key] } : x;
      });
      return { ...s, game: { ...s.game!, players } };
    });
  return (
    <div className="status-toggles">
      <button className={`st captain${p.captain ? ' on' : ''}`} onClick={() => toggle('captain')} title={t.captain}>
        <Star size={16} />
      </button>
      <button className={`st lover${p.lover ? ' on' : ''}`} onClick={() => toggle('lover')} title={t.lovers}>
        <Heart size={16} />
      </button>
      <button className={`st silenced${p.silenced ? ' on' : ''}`} onClick={() => toggle('silenced')} title={t.silenced}>
        <VolumeX size={16} />
      </button>
      <button className={`st dead${!p.alive ? ' on' : ''}`} onClick={() => toggle('alive')} title={p.alive ? t.alive : t.dead}>
        <Skull size={16} />
      </button>
    </div>
  );
}

function Overview() {
  const { s, update, t, f, role, name } = useStore();
  const g = s.game!;
  const [hidden, setHidden] = useState(false);
  const [peek, setPeek] = useState<number | null>(null);
  const [info, setInfo] = useState<RoleDef | null>(null);

  const alive = g.players.filter((p) => p.alive);
  const byTeam = (fn: (r: RoleDef) => boolean) => alive.filter((p) => fn(role(p.roleId))).length;
  const wolves = byTeam((r) => r.team === 'wolves');
  const village = byTeam((r) => r.team === 'village');
  const others = alive.length - wolves - village;

  const [ask, setAsk] = useState<'newRound' | 'setup' | null>(null);
  const newRound = () =>
    update((p) => ({ ...p, screen: 'reveal', game: deal(p.game!.players.map((x) => x.name), p.counts) }));
  const toSetup = () => update((p) => ({ ...p, screen: 'setup', game: null }));

  return (
    <div className="overview">
      <div className="stats">
        <div className="stat">
          <span className="stat-n">{alive.length}</span>
          <span className="stat-l">{f('aliveCount', { n: '' }).trim()}</span>
        </div>
        <div className="stat wolves">
          <span className="stat-n">{wolves}</span>
          <span className="stat-l">{t.wolvesLeft}</span>
        </div>
        <div className="stat village">
          <span className="stat-n">{village}</span>
          <span className="stat-l">{t.villageLeft}</span>
        </div>
        {others > 0 && (
          <div className="stat solo">
            <span className="stat-n">{others}</span>
            <span className="stat-l">{t.soloLeft}</span>
          </div>
        )}
      </div>

      <label className="switch-row">
        <span>
          <Moon size={16} /> {t.nightGuide}
        </span>
        <input
          type="checkbox"
          className="switch"
          checked={s.nightGuide}
          onChange={(e) => update((p) => ({ ...p, nightGuide: e.target.checked }))}
        />
      </label>

      <div className="overview-head">
        <span className="muted">{f('night', { n: g.night })}</span>
        <button className="btn ghost small" onClick={() => setHidden(!hidden)}>
          {hidden ? <Eye size={14} /> : <EyeOff size={14} />} {hidden ? t.showRoles : t.hideRoles}
        </button>
      </div>
      {hidden && <p className="hint">{t.holdToPeek}</p>}

      <div className="player-list">
        {g.players.map((p, i) => {
          const r = role(p.roleId);
          const show = !hidden || peek === i;
          return (
            <div key={i} className={`player-row${p.alive ? '' : ' is-dead'}`}>
              <button
                className="player-main"
                onClick={() => show && setInfo(r)}
                onPointerDown={() => hidden && setPeek(i)}
                onPointerUp={() => setPeek(null)}
                onPointerLeave={() => setPeek(null)}
                onContextMenu={(e) => e.preventDefault()}
              >
                <span className={`player-art${show ? '' : ' masked'}`}>
                  {show ? <RoleArt role={r} size={22} /> : <span className="q">?</span>}
                </span>
                <span className="player-text">
                  <span className="player-name">
                    {p.name}
                    {p.captain && <Star size={13} className="ico-captain" />}
                    {p.lover && <Heart size={13} className="ico-lover" />}
                    {p.silenced && <VolumeX size={13} className="ico-silenced" />}
                    {p.host && <BedDouble size={13} className="ico-host" />}
                  </span>
                  <span className={`player-role${show ? '' : ' masked'}`}>
                    {show ? name(r) : '••••••'}
                    {show && <span className={`team-dot team-${r.team}`} />}
                  </span>
                </span>
              </button>
              <StatusToggles p={p} i={i} />
            </div>
          );
        })}
      </div>

      {g.leftover.length > 0 && (
        <section className="panel">
          <h2 className="section-title small">{t.leftover}</h2>
          <div className="leftover">
            {g.leftover.map((id, i) => (
              <RoleCard key={i} role={role(id)} onClick={() => setInfo(role(id))} />
            ))}
          </div>
        </section>
      )}

      <div className="game-actions">
        <button className="btn primary" onClick={() => setAsk('newRound')}>
          <RotateCcw size={16} /> {t.newRound}
        </button>
        <button className="btn ghost" onClick={() => setAsk('setup')}>
          <Settings2 size={16} /> {t.toSetup}
        </button>
      </div>
      <p className="hint center">{t.newRoundHint}</p>

      {info && <RoleInfo role={info} onClose={() => setInfo(null)} />}
      {ask && (
        <Confirm
          title={ask === 'newRound' ? t.newRound : t.toSetup}
          message={ask === 'newRound' ? t.confirmNewRound : t.confirmSetup}
          confirmLabel={t.endRound}
          onConfirm={ask === 'newRound' ? newRound : toSetup}
          onClose={() => setAsk(null)}
        />
      )}
    </div>
  );
}

function NightGuide() {
  const { s, update, t, f, role, name } = useStore();
  const g = s.game!;
  const steps = buildSteps(g, role);
  const idx = Math.min(g.step, steps.length - 1);
  const step = steps[idx];
  const setGame = (fn: (g: Game) => Game) => update((p) => ({ ...p, game: fn(p.game!) }));
  const go = (d: number) => setGame((x) => ({ ...x, step: Math.max(0, Math.min(steps.length - 1, idx + d)) }));
  const nextNight = () =>
    setGame((x) => ({
      ...x,
      night: x.night + 1,
      step: 0,
      players: x.players.map((p) => ({ ...p, silenced: false, prevHost: !!p.host, host: false })),
    }));

  const alivePlayers = g.players.map((p, i) => ({ p, i })).filter(({ p }) => p.alive);
  const silenced = g.players.filter((p) => p.silenced);

  const setFlag = (i: number, key: 'silenced' | 'lover' | 'host', exclusive: boolean) =>
    setGame((x) => ({
      ...x,
      players: x.players.map((p, j) => {
        if (j === i) return { ...p, [key]: !p[key] };
        if (exclusive) return { ...p, [key]: false };
        return p;
      }),
    }));

  let body: React.ReactNode;
  if (step.kind === 'sleep') {
    body = (
      <div className="step-card night">
        <div className="step-icon moon">
          <Moon size={64} />
        </div>
        <h2 className="step-title">{t.villageSleeps}</h2>
        <p className="step-text">{t.villageSleepsText}</p>
      </div>
    );
  } else if (step.kind === 'wake') {
    const noCaptain = !g.players.some((p) => p.captain);
    body = (
      <div className="step-card day">
        <div className="step-icon sun">
          <Sun size={64} />
        </div>
        <h2 className="step-title">{t.villageWakes}</h2>
        <p className="step-text">{t.villageWakesText}</p>
        {silenced.map((p) => (
          <p key={p.name} className="callout silence">
            <VolumeX size={18} /> {f('silencedToday', { name: p.name })}
          </p>
        ))}
        {g.players
          .filter((p) => p.host)
          .map((p) => (
            <p key={p.name} className="callout">
              <BedDouble size={18} /> {f('hostToday', { name: p.name })}
            </p>
          ))}
        {noCaptain && g.night === 1 && (
          <p className="callout">
            <Star size={18} /> {t.captainElection}
          </p>
        )}
      </div>
    );
  } else {
    const r = step.role;
    const anyAlive = step.holders.some((i) => g.players[i].alive);
    const special = r.night!.special;
    const lovers = g.players.filter((p) => p.lover).length;
    body = (
      <div className="step-card">
        <div className="step-art">
          <RoleArt role={r} size={64} />
        </div>
        <h2 className="step-title">{r.id === 'werewolf' ? t.team_wolves : name(r)}</h2>
        <p className="step-text">{tr(r.night!.text, s.lang)}</p>
        <div className="holders">
          <span className="muted">{t.wakes}</span>
          {step.holders.length ? (
            step.holders.map((i) => (
              <span key={i} className={`holder${g.players[i].alive ? '' : ' dead'}`}>
                {g.players[i].name}
                {r.id === 'werewolf' && role(g.players[i].roleId).id !== 'werewolf' && (
                  <small> ({name(role(g.players[i].roleId))})</small>
                )}
              </span>
            ))
          ) : (
            <span className="holder dead">—</span>
          )}
        </div>
        {!anyAlive && <p className="callout muted">{t.nobodyAlive}</p>}

        {special === 'silence' && anyAlive && (
          <div className="picker">
            <h3>{t.pickSilenced}</h3>
            <div className="pick-grid">
              {alivePlayers.map(({ p, i }) => (
                <button key={i} className={`pick${p.silenced ? ' on' : ''}`} onClick={() => setFlag(i, 'silenced', true)}>
                  {p.silenced && <VolumeX size={14} />} {p.name}
                </button>
              ))}
            </div>
          </div>
        )}
        {special === 'host' && anyAlive && (
          <div className="picker">
            <h3>{t.pickHost}</h3>
            <div className="pick-grid">
              {alivePlayers
                .filter(({ i }) => !step.holders.includes(i))
                .map(({ p, i }) => (
                  <button
                    key={i}
                    className={`pick${p.host ? ' on' : ''}`}
                    disabled={!!p.prevHost && !p.host}
                    title={p.prevHost ? t.lastNight : undefined}
                    onClick={() => setFlag(i, 'host', true)}
                  >
                    {p.host && <BedDouble size={14} />} {p.name}
                  </button>
                ))}
            </div>
          </div>
        )}
        {special === 'lovers' && anyAlive && (
          <div className="picker">
            <h3>{t.pickLovers}</h3>
            <div className="pick-grid">
              {alivePlayers.map(({ p, i }) => (
                <button
                  key={i}
                  className={`pick love${p.lover ? ' on' : ''}`}
                  disabled={!p.lover && lovers >= 2}
                  onClick={() => setFlag(i, 'lover', false)}
                >
                  {p.lover && <Heart size={14} />} {p.name}
                </button>
              ))}
            </div>
          </div>
        )}
        {special === 'thief' && g.leftover.length > 0 && (
          <div className="picker">
            <h3>{t.pickThief}</h3>
            <div className="leftover">
              {g.leftover.map((id, ci) => {
                const chosen = g.thiefSwap?.card === ci;
                return (
                  <div key={ci} className={`thief-pick${chosen ? ' on' : ''}`}>
                    <RoleCard
                      role={chosen ? role(g.players[g.thiefSwap!.player].roleId) : role(id)}
                      onClick={() => setGame((x) => swapThief(x, chosen ? null : ci))}
                    />
                  </div>
                );
              })}
            </div>
            <button
              className={`pick${!g.thiefSwap ? ' on' : ''}`}
              onClick={() => setGame((x) => swapThief(x, null))}
            >
              {t.keepCard}
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="night-guide">
      <div className="night-head">
        <span className={`phase-pill ${step.kind === 'wake' ? 'day' : 'night'}`}>
          {step.kind === 'wake' ? <Sun size={14} /> : <Moon size={14} />}
          {step.kind === 'wake' ? f('day', { n: g.night }) : f('night', { n: g.night })}
        </span>
        <span className="muted">{f('stepOf', { i: idx + 1, n: steps.length })}</span>
      </div>
      <div className="step-dots">
        {steps.map((st, i) => (
          <button
            key={i}
            className={`dot${i === idx ? ' active' : ''}${i < idx ? ' past' : ''}`}
            onClick={() => setGame((x) => ({ ...x, step: i }))}
            aria-label={st.kind === 'role' ? name(st.role) : st.kind}
          />
        ))}
      </div>
      <div className="step-wrap" key={`${g.night}-${idx}`}>
        {body}
      </div>
      <div className="bottom-bar">
        <div className="bar-inner">
          <button className="btn ghost" onClick={() => go(-1)} disabled={idx === 0}>
            <ChevronLeft size={18} /> <span className="hide-sm">{t.prevStep}</span>
          </button>
          <span className="spacer" />
          {step.kind === 'wake' ? (
            <button className="btn primary" onClick={nextNight}>
              <Moon size={16} /> {t.nextNight}
            </button>
          ) : (
            <button className="btn primary" onClick={() => go(1)}>
              {t.nextStep} <ChevronRight size={18} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
