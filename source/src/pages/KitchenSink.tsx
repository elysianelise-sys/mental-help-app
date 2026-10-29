import {
  Button,
  BottomSheet,
  Card,
  EmptyState,
  Pill,
  ProgressBar,
  StepSegments,
  Toast,
  Skeleton,
} from '../components/ui/DesignSystem';
import { Icon } from '../components/ui/Icon';
import { EMOTIONS } from '../mascot/emotions';
import {
  BreathWave,
  BreathingOrb,
  EmotionBadge,
  LogoMark,
  Orb,
  SessionCompanion,
} from '../mascot/Mascot';
import { useReducedMotionPref } from '../providers/PreferencesProvider';
export default function KitchenSink() {
  const { mode, reduced, setMode } = useReducedMotionPref();
  return (
    <main className="dev-page">
      <h1>Design system kitchen sink</h1>
      <p>
        Reduced motion: {String(reduced)} ({mode}){' '}
        <select value={mode} onChange={(e) => setMode(e.target.value as 'system' | 'on' | 'off')}>
          <option value="system">System</option>
          <option value="on">On</option>
          <option value="off">Off</option>
        </select>
      </p>
      <section>
        <h2>Buttons</h2>
        <div className="row">
          <Button>Primary pill</Button>
          <Button variant="secondary-pill">Secondary pill</Button>
          {(['icon-circle-44', 'icon-circle-40', 'icon-circle-36', 'icon-circle-32'] as const).map(
            (v) => (
              <Button key={v} variant={v} aria-label={v}>
                <Icon name="plus" size={18} />
              </Button>
            ),
          )}
          <Button variant="text-link">Text link ›</Button>
        </div>
      </section>
      <section>
        <h2>Pills</h2>
        <div className="row">
          {(['eyebrow', 'status', 'filter', 'toggle', 'influence'] as const).map((v) => (
            <Pill key={v} variant={v} selected={v === 'filter'}>
              {v}
            </Pill>
          ))}
        </div>
      </section>
      <section>
        <h2>Cards and progress</h2>
        <div className="row">
          {(['feature-gradient', 'white-32', 'blush', 'checkout-16'] as const).map((v) => (
            <Card key={v} variant={v}>
              {v}
            </Card>
          ))}
        </div>
        <ProgressBar value={68} />
        <StepSegments />
        <StepSegments step={2} />
      </section>
      <section>
        <h2>Feedback and empty states</h2>
        <div className="row">
          <BottomSheet>Bottom sheet · example</BottomSheet>
          <Toast>Toast message</Toast>
          <EmptyState>Nothing here yet.</EmptyState>
          <Skeleton />
        </div>
      </section>
      <section>
        <h2>Mascot</h2>
        <div className="row">
          <Orb size={80} />
          <BreathingOrb />
          <SessionCompanion days={4} />
          <LogoMark />
        </div>
        <BreathWave />
      </section>
      <section>
        <h2>Emotion badges</h2>
        <div className="emotion-list">
          {EMOTIONS.map((e) => (
            <EmotionBadge key={e.key} emotion={e.key} />
          ))}
        </div>
      </section>
    </main>
  );
}
