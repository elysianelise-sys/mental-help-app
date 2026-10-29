import { useMemo } from 'react';
import AppHeader from '../../components/layout/AppHeader';
import { Icon } from '../../components/ui/Icon';
import { BreathWave, BreathingOrb } from '../../mascot/Mascot';
import { useBreathPhase } from '../../mascot/useBreathPhase';
import { useAudio } from '../../providers/AudioProvider';
import { THERAPIST_PHOTO } from '../../data/therapists';
import styles from './CalmPage.module.css';

const phaseCopy = {
  inhale: 'Breathe in...',
  hold: 'Hold...',
  exhale: 'Breathe out...',
  paused: 'Paused',
} as const;

function formatTime(seconds: number) {
  const wholeSeconds = Math.max(0, Math.floor(seconds));
  const minutes = Math.floor(wholeSeconds / 60);
  return `${String(minutes).padStart(2, '0')}:${String(wholeSeconds % 60).padStart(2, '0')}`;
}

export default function CalmPage() {
  const audio = useAudio();
  const isPlaying = audio.status === 'playing';
  const isLoading = audio.status === 'loading';
  const guidanceActive = isPlaying || audio.status === 'error';
  const phase = useBreathPhase(guidanceActive);
  const progress = audio.duration ? audio.currentTime / audio.duration : 0;
  const timerLabel = audio.sleepTimerMin === 0 ? 'Off' : `${audio.sleepTimerMin}m`;
  const ariaTime = useMemo(
    () => `${formatTime(audio.currentTime)} of ${formatTime(audio.duration)}`,
    [audio.currentTime, audio.duration],
  );

  return (
    <>
      <AppHeader title="Calm" back />
      <main className={styles.page}>
        <div className={styles.trackPill}>
          <span className={styles.pillDot} />
          <span>Guided Calm • {Math.round(audio.track.durationSec / 60)} min</span>
        </div>

        <section className={styles.mascotCard} aria-hidden="true">
          <BreathingOrb size={192} playing={isPlaying} />
        </section>

        <div className={styles.breathCue} aria-live="polite">
          <Icon name="navCalm" size={16} />
          <span>{phaseCopy[phase]}</span>
        </div>

        <section className={styles.trackInfo}>
          <h2>{audio.track.title}</h2>
          <div className={styles.therapist}>
            {THERAPIST_PHOTO[audio.track.therapist] ? (
              <img src={THERAPIST_PHOTO[audio.track.therapist]} alt={audio.track.therapist} />
            ) : (
              <span className={styles.therapistAvatar} aria-hidden="true">
                <Icon name="therapist" size={16} />
              </span>
            )}
            <span className={styles.therapistWith}>
              with {audio.track.therapist}
              <Icon name="verified" size={16} />
            </span>
            <span>{audio.track.therapistRole}</span>
          </div>
          {import.meta.env.DEV && !audio.track.src && (
            <p className={styles.previewNote}>Preview mode – audio coming soon</p>
          )}
        </section>

        {audio.status === 'error' && (
          <div className={styles.errorMessage} role="alert">
            <p>We couldn't load this audio. Check your connection and try again.</p>
            <button onClick={() => void audio.retry()}>Try again</button>
          </div>
        )}

        {audio.status === 'completed' && (
          <div className={styles.completion} role="status">
            <p>Nicely done. Take that calm with you.</p>
            <button onClick={() => void audio.play()}>Replay</button>
          </div>
        )}

        <section className={styles.waveArea} aria-label="Audio progress">
          <BreathWave progress={progress} playing={isPlaying} />
          <input
            className={styles.scrubber}
            type="range"
            min={0}
            max={audio.duration}
            step={5}
            value={Math.min(audio.currentTime, audio.duration)}
            disabled={isLoading}
            aria-label="Seek through the audio"
            aria-valuemin={0}
            aria-valuemax={audio.duration}
            aria-valuenow={Math.floor(audio.currentTime)}
            aria-valuetext={ariaTime}
            style={{
              background: `linear-gradient(to right, var(--primary) ${progress * 100}%, var(--surface-blush-2) ${progress * 100}%)`,
            }}
            onChange={(event) => audio.seek(Number(event.currentTarget.value))}
          />
          <div className={styles.timestamps}>
            <span>{formatTime(audio.currentTime)}</span>
            <span>{formatTime(audio.duration)}</span>
          </div>
        </section>

        <div className={styles.controls} aria-label="Playback controls">
          <button
            className={styles.sideControl}
            aria-label="Rewind 15 seconds"
            onClick={() => audio.seek(audio.currentTime - 15)}
          >
            <Icon name="rewind15" size={20} />
          </button>
          <button
            className={styles.playControl}
            aria-label={
              isLoading
                ? 'Loading audio'
                : audio.status === 'completed'
                  ? 'Replay'
                  : isPlaying
                    ? 'Pause'
                    : 'Play'
            }
            disabled={isLoading}
            onClick={audio.togglePlayback}
          >
            {isLoading ? (
              <span className={styles.loadingRing} aria-hidden="true" />
            ) : (
              <Icon name={isPlaying ? 'pause' : 'play'} size={24} />
            )}
            {isLoading && <span className={styles.visuallyHidden}>Loading…</span>}
          </button>
          <button
            className={styles.sideControl}
            aria-label="Forward 15 seconds"
            onClick={() => audio.seek(audio.currentTime + 15)}
          >
            <Icon name="forward15" size={20} />
          </button>
        </div>

        <div className={styles.toggles}>
          <button
            className={styles.toggle}
            aria-label={`Rain sounds, ${audio.ambientOn ? 'on' : 'off'}`}
            aria-pressed={audio.ambientOn}
            onClick={() => audio.setAmbient(!audio.ambientOn)}
          >
            <Icon name="stress" size={16} />
            <span>Rain Sounds</span>
            <span className={styles.toggleState}>{audio.ambientOn ? 'On' : 'Off'}</span>
            <i className={audio.ambientOn ? styles.rainActive : ''} />
          </button>
          <button
            className={styles.toggle}
            aria-label={`Sleep timer, ${timerLabel}`}
            onClick={audio.cycleSleepTimer}
          >
            <Icon name="moon" size={17} />
            <span>Timer ({timerLabel})</span>
          </button>
        </div>
      </main>

      {audio.toast && (
        <div className={styles.toast} role="status">
          <span>{audio.toast}</span>
          <button aria-label="Dismiss message" onClick={audio.dismissToast}>
            <Icon name="close" size={14} />
          </button>
        </div>
      )}
    </>
  );
}
