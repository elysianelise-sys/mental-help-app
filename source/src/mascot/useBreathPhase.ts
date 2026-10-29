import { useEffect, useState } from 'react';
import { BREATH } from './emotions';
export type BreathPhase = 'inhale' | 'hold' | 'exhale';
export function useBreathPhase(playing = true) {
  const [phase, setPhase] = useState<BreathPhase>('inhale');
  useEffect(() => {
    if (!playing) return;
    const startedAt = performance.now();
    const update = () => {
      const t = ((performance.now() - startedAt) / 1000) % BREATH.total;
      setPhase(t < BREATH.inhale ? 'inhale' : t < BREATH.inhale + BREATH.hold ? 'hold' : 'exhale');
    };
    update();
    const id = window.setInterval(update, 150);
    return () => window.clearInterval(id);
  }, [playing]);
  return playing ? phase : ('paused' as BreathPhase | 'paused');
}
