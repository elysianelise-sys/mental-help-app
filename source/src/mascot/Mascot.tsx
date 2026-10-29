import { motion, useInView } from 'motion/react';
import { useEffect, useId, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import { BREATH, EMOTIONS, orbFill, type EmotionKey } from './emotions';
import { useReducedMotionPref } from '../providers/PreferencesProvider';
export function Orb({
  emotion = 'calm',
  size = 56,
  ...props
}: {
  emotion?: EmotionKey;
  size?: number;
  [key: string]: unknown;
}) {
  const e = EMOTIONS.find((x) => x.key === emotion)!;
  return (
    <div
      aria-hidden="true"
      className="orb"
      style={{
        width: size,
        height: size,
        background: orbFill(emotion),
        transform: `translateY(${e.float < 0 ? Math.abs(e.float) : 0}px) scaleY(${emotion === 'depleted' ? 0.9 : 1})`,
        opacity: emotion === 'depleted' ? 0.88 : 1,
        ...(props as CSSProperties),
      }}
    />
  );
}
export function BreathingOrb({
  size = 190,
  playing = true,
  emotion = 'calm',
}: {
  size?: number;
  playing?: boolean;
  emotion?: EmotionKey;
}) {
  const { reduced } = useReducedMotionPref();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: false, margin: '-24px' });
  const animate = playing && !reduced && inView;
  return (
    <div
      ref={ref}
      style={{
        width: size + 24,
        height: size + 24,
        display: 'grid',
        placeItems: 'center',
        position: 'relative',
      }}
    >
      <motion.div
        aria-hidden="true"
        style={{
          position: 'absolute',
          width: size + 18,
          height: size + 18,
          borderRadius: '50%',
          background: 'radial-gradient(circle,rgba(249,168,212,.5),rgba(249,168,212,0) 70%)',
        }}
        animate={
          animate
            ? { opacity: [0.35, 0.85, 0.85, 0.35], scale: [0.9, 1.05, 1.05, 0.9] }
            : { opacity: 0.5, scale: 1 }
        }
        transition={{
          duration: animate ? BREATH.total : 0.6,
          repeat: animate ? Infinity : 0,
          ease: 'easeInOut',
          times: BREATH.times,
        }}
      />
      <motion.div
        animate={animate ? { scale: BREATH.scale } : { scale: 0.92 }}
        transition={{
          duration: animate ? BREATH.total : 0.6,
          repeat: animate ? Infinity : 0,
          ease: 'easeInOut',
          times: BREATH.times,
        }}
      >
        <Orb size={size} emotion={emotion} />
      </motion.div>
    </div>
  );
}
export function MoodOrb({
  emotion,
  size = 56,
  settled = false,
  paused = false,
  className,
}: {
  emotion: EmotionKey;
  size?: number;
  settled?: boolean;
  paused?: boolean;
  className?: string;
}) {
  const e = EMOTIONS.find((x) => x.key === emotion)!;
  const { reduced } = useReducedMotionPref();
  const float = settled ? 0 : e.float;
  const squash = settled ? 0 : e.squash;
  const animated = !reduced && !paused;
  return (
    <motion.div
      aria-hidden="true"
      className={`orb ${className ?? ''}`}
      style={{
        width: size,
        height: size,
        background: orbFill(emotion),
        opacity: emotion === 'depleted' ? 0.88 : 1,
        transform: emotion === 'depleted' ? 'translateY(4px) scaleY(.9)' : undefined,
        boxShadow:
          'inset -8px -10px 22px rgba(100,65,90,.18),inset 5px 6px 12px rgba(255,255,255,.8),0 12px 28px rgba(143,72,91,.18)',
      }}
      animate={
        animated
          ? {
              y: [0, -float, 0],
              scaleX: [1, 1 + squash * 0.6, 1],
              scaleY: [1, 1 - squash, 1],
              rotate: e.settles && !settled ? [0, 2, -2, 1, 0] : 0,
            }
          : { y: 0, scaleX: 1, scaleY: emotion === 'depleted' ? 0.9 : 1, rotate: 0 }
      }
      transition={{
        duration: settled ? 6 : e.tempo,
        repeat: animated ? Infinity : 0,
        ease: 'easeInOut',
      }}
    />
  );
}
export function EmotionBadge({
  emotion,
  selected = false,
  onSelect,
  className,
  tabIndex,
}: {
  emotion: EmotionKey;
  selected?: boolean;
  onSelect?: () => void;
  className?: string;
  tabIndex?: number;
}) {
  const e = EMOTIONS.find((x) => x.key === emotion)!;
  const { reduced } = useReducedMotionPref();
  const [settled, setSettled] = useState(false);
  const [hovered, setHovered] = useState(false);
  useEffect(() => {
    setSettled(false);
    if (!selected || !e.settles) return;
    const timer = window.setTimeout(() => setSettled(true), 3500);
    return () => window.clearTimeout(timer);
  }, [emotion, selected, e.settles]);
  return (
    <motion.button
      type="button"
      className={`emotion-badge${selected ? ' selected' : ''}${className ? ` ${className}` : ''}`}
      whileHover={
        !reduced ? { rotate: [0, -4, 3, -1.5, 0], transition: { duration: 0.6 } } : undefined
      }
      whileTap={
        !reduced
          ? { scale: 0.94, transition: { type: 'spring', stiffness: 420, damping: 18 } }
          : undefined
      }
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      aria-label={e.label}
      {...(onSelect
        ? {
            'aria-checked': selected,
            role: 'radio' as const,
            tabIndex: tabIndex ?? (selected ? 0 : -1),
          }
        : { role: 'button' as const })}
      onClick={onSelect}
    >
      <MoodOrb emotion={emotion} settled={settled && selected} paused={hovered} size={56} />
      <span>{e.label}</span>
    </motion.button>
  );
}
export function BreathWave({
  progress = 0,
  playing = true,
}: {
  progress?: number;
  playing?: boolean;
}) {
  const { reduced } = useReducedMotionPref();
  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref, { once: false, margin: '-24px' });
  const animate = playing && !reduced && inView;
  const clipId = `breath-wave-${useId().replace(/:/g, '')}`;
  const points = Array.from({ length: 57 }, (_, index) => {
    const x = Math.min(index * 6, 334);
    const envelope = Math.sin((Math.PI * x) / 334);
    const y = 20 + Math.sin(x / 20) * 12 * envelope;
    return `${index === 0 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(2)}`;
  }).join(' ');
  return (
    <svg ref={ref} width="100%" height="40" viewBox="0 0 334 40" aria-hidden="true">
      <defs>
        <clipPath id={clipId}>
          <rect x="0" y="0" width={334 * Math.max(0, Math.min(1, progress))} height="40" />
        </clipPath>
      </defs>
      <motion.g
        style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
        animate={animate ? { scaleY: [0.25, 1, 1, 0.25] } : { scaleY: 0.25 }}
        transition={{
          duration: BREATH.total,
          repeat: animate ? Infinity : 0,
          ease: 'easeInOut',
          times: BREATH.times,
        }}
      >
        <path d={points} fill="none" stroke="#FAD6E9" strokeWidth="3" />
        <path
          d={points}
          fill="none"
          stroke="#8F485B"
          strokeWidth="3"
          clipPath={`url(#${clipId})`}
        />
      </motion.g>
    </svg>
  );
}
export function SessionCompanion({ days = 4 }: { days?: number }) {
  const { reduced } = useReducedMotionPref();
  return (
    <motion.div
      className="session-companion"
      aria-hidden="true"
      style={{ width: 'min(320px, 100%)', aspectRatio: '1 / 1' }}
      whileHover={reduced ? undefined : { scale: 1.02 }}
      whileTap={reduced ? undefined : { scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 260, damping: 16 }}
    >
      <motion.div
        className="session-orbit"
        aria-hidden="true"
        animate={reduced ? { rotate: 0 } : { rotate: 360 }}
        transition={{ duration: 60, repeat: reduced ? 0 : Infinity, ease: 'linear' }}
      >
        {Array.from({ length: Math.min(Math.max(days, 3), 8) }, (_, index) => {
          const angle = (index * 360) / days;
          return (
            <span
              key={`${days}-${index}`}
              className="session-satellite-position"
              style={{ '--satellite-angle': `${angle}deg` } as CSSProperties}
            >
              <motion.i
                className="session-satellite"
                style={{ background: orbFill('calm') }}
                initial={reduced ? false : { scale: 0 }}
                animate={{ scale: 1 }}
                transition={
                  reduced
                    ? { duration: 0 }
                    : { type: 'spring', stiffness: 180, damping: 17, delay: index * 0.04 }
                }
              />
            </span>
          );
        })}
      </motion.div>
      <BreathingOrb size={176} emotion="joyful" />
    </motion.div>
  );
}
export function LogoMark() {
  return (
    <svg role="img" aria-label="Mental Help" width="24" height="24" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" fill="#F7C6D4" />
      <path
        d="M7 11.2c1.3-2.3 3.1-2.3 5 0M12 11.2c1.3-2.3 3.1-2.3 5 0"
        stroke="#8F485B"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}
