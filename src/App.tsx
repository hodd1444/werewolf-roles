import { useStore } from './store';
import { Setup } from './screens/Setup';
import { Names } from './screens/Names';
import { Reveal } from './screens/Reveal';
import { GameScreen } from './screens/Game';
import { spiralPath } from './components/Card';

const BG_SPIRAL = spiralPath(5, 320, 3, 48);

/** SVG filters that give frames and icons their hand-painted, wobbly edges. */
function PaintDefs() {
  return (
    <svg className="paint-defs" aria-hidden width="0" height="0">
      <filter id="rough" x="-4%" y="-4%" width="108%" height="108%">
        <feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="2" seed="4" result="n" />
        <feDisplacementMap in="SourceGraphic" in2="n" scale="6" xChannelSelector="R" yChannelSelector="G" />
      </filter>
      <filter id="paint" x="-10%" y="-10%" width="120%" height="120%">
        <feTurbulence type="fractalNoise" baseFrequency="0.07" numOctaves="2" seed="11" result="n" />
        <feDisplacementMap in="SourceGraphic" in2="n" scale="3" xChannelSelector="R" yChannelSelector="G" />
      </filter>
      <filter id="brush" x="-10%" y="-10%" width="120%" height="120%">
        <feTurbulence type="fractalNoise" baseFrequency="0.02 0.3" numOctaves="3" seed="2" result="n" />
        <feDisplacementMap in="SourceGraphic" in2="n" scale="7" xChannelSelector="R" yChannelSelector="G" />
      </filter>
    </svg>
  );
}

export function App() {
  const { s, update, t } = useStore();
  return (
    <div className="app">
      <PaintDefs />
      <svg className="bg-spiral" viewBox="0 0 100 100" aria-hidden>
        <path d={BG_SPIRAL} />
      </svg>
      <header className="topbar">
        <div className="brand">
          <span className="brand-title">{t.appTitle}</span>
          <span className="brand-sub">{t.appSub}</span>
        </div>
        <div className="lang-switch" role="group" aria-label={t.language}>
          {(['de', 'en'] as const).map((l) => (
            <button
              key={l}
              className={s.lang === l ? 'active' : ''}
              onClick={() => update((p) => ({ ...p, lang: l }))}
            >
              {l.toUpperCase()}
            </button>
          ))}
        </div>
      </header>
      <main className="screen" key={s.screen}>
        {s.screen === 'setup' && <Setup />}
        {s.screen === 'names' && <Names />}
        {s.screen === 'reveal' && <Reveal />}
        {s.screen === 'game' && <GameScreen />}
      </main>
    </div>
  );
}
