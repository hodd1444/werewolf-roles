import { ArrowLeft, EyeOff, Moon } from 'lucide-react';
import { useStore } from '../store';
import { CardBack, RoleCard } from '../components/Card';

export function Reveal() {
  const { s, update, t, f, role, desc } = useStore();
  const g = s.game!;
  const n = g.players.length;
  const setGame = (patch: Partial<typeof g>) => update((p) => ({ ...p, game: { ...p.game!, ...patch } }));

  if (g.revealIndex >= n) {
    return (
      <div className="reveal done">
        <div className="moon-glow">
          <Moon size={72} />
        </div>
        <h1 className="screen-title">{t.allRevealed}</h1>
        <p className="hint center">{t.allRevealedHint}</p>
        <button
          className="btn primary huge"
          onClick={() => update((p) => ({ ...p, screen: 'game', game: { ...p.game!, tab: p.nightGuide ? 'night' : 'overview', step: 0 } }))}
        >
          {t.startGame}
        </button>
        <button className="btn ghost" onClick={() => setGame({ revealIndex: n - 1, revealed: false })}>
          <ArrowLeft size={16} /> {t.back}
        </button>
      </div>
    );
  }

  const player = g.players[g.revealIndex];
  const r = role(player.roleId);
  const nextPlayer = g.players[g.revealIndex + 1];

  return (
    <div className="reveal">
      <div className="progress">
        <span>{f('cardOf', { i: g.revealIndex + 1, n })}</span>
        <div className="progress-bar">
          <div style={{ width: `${(g.revealIndex / n) * 100}%` }} />
        </div>
      </div>

      {!g.revealed ? (
        <>
          <p className="pass-label">{t.passTo}</p>
          <h1 className="pass-name">{player.name}</h1>
        </>
      ) : (
        <p className="pass-label warn">
          <EyeOff size={16} /> {f('onlyYou', { name: player.name })}
        </p>
      )}

      <div
        className={`flip${g.revealed ? ' flipped' : ''}`}
        key={g.revealIndex}
        onClick={() => !g.revealed && setGame({ revealed: true })}
      >
        <div className="flip-inner">
          <div className="flip-face flip-back">
            <CardBack big />
          </div>
          <div className="flip-face flip-front">{g.revealed && <RoleCard role={r} big />}</div>
        </div>
      </div>

      {g.revealed ? (
        <>
          <p className="role-desc">{desc(r)}</p>
          <button
            className="btn primary huge"
            onClick={() => setGame({ revealIndex: g.revealIndex + 1, revealed: false })}
          >
            {t.hideCard}
          </button>
          {nextPlayer && <p className="hint center">{f('nextIs', { name: nextPlayer.name })}</p>}
        </>
      ) : (
        <>
          <button className="btn primary huge" onClick={() => setGame({ revealed: true })}>
            {f('revealAs', { name: player.name })}
          </button>
          {g.revealIndex === 0 && (
            <button className="btn ghost" onClick={() => update((p) => ({ ...p, screen: 'names', game: null }))}>
              <ArrowLeft size={16} /> {t.back}
            </button>
          )}
        </>
      )}
    </div>
  );
}
