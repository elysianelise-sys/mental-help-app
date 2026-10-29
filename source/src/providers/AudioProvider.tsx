import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { useLocation } from 'react-router-dom';
import trackManifest from '../data/mock/tracks.json';
import { readSession, writeSession } from '../data/storage';
import { useReducedMotionPref } from './PreferencesProvider';

type Track = {
  id: string;
  title: string;
  therapist: string;
  therapistRole: string;
  durationSec: number;
  src: string | null;
  ambientDefault: 'rain' | null;
  ambientSrc: string | null;
  durationIsPlaceholder?: boolean;
};
export type AudioStatus = 'idle' | 'loading' | 'playing' | 'paused' | 'completed' | 'error';
export type SleepTimerMinutes = 0 | 5 | 10 | 15 | 30;
type AudioState = {
  status: AudioStatus;
  currentTime: number;
  duration: number;
  ambientOn: boolean;
  sleepTimerMin: SleepTimerMinutes;
  timerRemaining: number;
  toast: string | null;
};
type ContextValue = AudioState & {
  track: Track;
  play: () => Promise<void>;
  pause: () => void;
  togglePlayback: () => void;
  seek: (seconds: number) => void;
  setAmbient: (enabled: boolean) => void;
  cycleSleepTimer: () => void;
  dismissToast: () => void;
  retry: () => Promise<void>;
};

const trackManifestTyped = trackManifest as Track[];
const AUDIO_POSITION_KEY = 'mh.audio-position.v1';
const TIMER_OPTIONS: SleepTimerMinutes[] = [0, 5, 10, 15, 30];
const AudioContext = createContext<ContextValue | null>(null);

export function AudioProvider({ children }: { children: ReactNode }) {
  const location = useLocation();
  const requestedTrackId = new URLSearchParams(location.search).get('track');
  const track =
    trackManifestTyped.find((item) => item.id === requestedTrackId) ?? trackManifestTyped[0];
  const preferences = useReducedMotionPref();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const ambientRef = useRef<HTMLAudioElement | null>(null);
  const previousPath = useRef(location.pathname);
  const resumeOnReturn = useRef(false);
  const [state, setState] = useState<AudioState>(() => {
    const saved = readSession<{ trackId?: string; currentTime?: number }>(AUDIO_POSITION_KEY, {});
    const savedTime = saved.trackId === track.id ? (saved.currentTime ?? 0) : 0;
    return {
      status: savedTime >= track.durationSec ? 'completed' : 'idle',
      currentTime: Math.max(0, Math.min(track.durationSec, savedTime)),
      duration: track.durationSec,
      ambientOn: preferences.ambientOn,
      sleepTimerMin: 0,
      timerRemaining: 0,
      toast: null,
    };
  });
  const currentTrackId = useRef(track.id);
  const stateRef = useRef(state);
  const update = useCallback((next: AudioState | ((current: AudioState) => AudioState)) => {
    const value = typeof next === 'function' ? next(stateRef.current) : next;
    stateRef.current = value;
    setState(value);
  }, []);

  useEffect(() => {
    if (currentTrackId.current === track.id) return;
    currentTrackId.current = track.id;
    const saved = readSession<{ trackId?: string; currentTime?: number }>(AUDIO_POSITION_KEY, {});
    const savedTime = saved.trackId === track.id ? (saved.currentTime ?? 0) : 0;
    update({
      status: savedTime >= track.durationSec ? 'completed' : 'idle',
      currentTime: Math.max(0, Math.min(track.durationSec, savedTime)),
      duration: track.durationSec,
      ambientOn: preferences.ambientOn,
      sleepTimerMin: 0,
      timerRemaining: 0,
      toast: null,
    });
  }, [track.id, track.durationSec, preferences.ambientOn, update]);

  const pause = useCallback(() => {
    audioRef.current?.pause();
    ambientRef.current?.pause();
    update((current) =>
      current.status === 'playing' || current.status === 'loading'
        ? { ...current, status: 'paused' }
        : current,
    );
  }, [update]);

  const ensureAmbient = useCallback(() => {
    if (!track.ambientSrc) return null;
    if (!ambientRef.current) {
      const ambient = new Audio();
      ambient.preload = 'none';
      ambient.loop = true;
      ambient.volume = 0.35;
      ambient.src = track.ambientSrc;
      ambientRef.current = ambient;
    }
    return ambientRef.current;
  }, [track.ambientSrc]);

  const play = useCallback(async () => {
    const current = stateRef.current;
    const startAt = current.status === 'completed' ? 0 : current.currentTime;
    if (track.src && audioRef.current) {
      try {
        audioRef.current.currentTime = startAt;
        if (current.ambientOn) {
          const ambient = ensureAmbient();
          if (ambient) void ambient.play().catch(() => undefined);
        }
        update({ ...current, currentTime: startAt, status: 'loading', toast: null });
        await audioRef.current.play();
        update((latest) => (latest.status === 'error' ? latest : { ...latest, status: 'playing' }));
      } catch {
        update((latest) => ({ ...latest, status: 'paused' }));
      }
      return;
    }
    update({ ...current, currentTime: startAt, status: 'playing', toast: null });
  }, [ensureAmbient, track.src, update]);

  const seek = useCallback(
    (seconds: number) => {
      const current = stateRef.current;
      const nextTime = Math.max(0, Math.min(current.duration, seconds));
      if (audioRef.current && track.src) audioRef.current.currentTime = nextTime;
      if (nextTime >= current.duration) {
        audioRef.current?.pause();
        ambientRef.current?.pause();
        update((latest) => ({ ...latest, currentTime: latest.duration, status: 'completed' }));
      } else {
        update((latest) => ({
          ...latest,
          currentTime: nextTime,
          status: latest.status === 'completed' ? 'paused' : latest.status,
        }));
      }
    },
    [update],
  );

  const setAmbient = useCallback(
    (enabled: boolean) => {
      preferences.setAmbientOn(enabled);
      update((current) => ({ ...current, ambientOn: enabled }));
      const ambient =
        enabled && stateRef.current.status === 'playing' ? ensureAmbient() : ambientRef.current;
      if (!ambient) return;
      if (enabled && stateRef.current.status === 'playing') {
        void ambient.play().catch(() => undefined);
      } else if (!enabled) ambient.pause();
    },
    [ensureAmbient, preferences.setAmbientOn, update],
  );

  const cycleSleepTimer = useCallback(() => {
    const current = stateRef.current;
    const index = TIMER_OPTIONS.indexOf(current.sleepTimerMin);
    const next = TIMER_OPTIONS[(index + 1) % TIMER_OPTIONS.length];
    update((latest) => ({
      ...latest,
      sleepTimerMin: next,
      timerRemaining: next * 60,
      toast: null,
    }));
  }, [update]);

  const retry = useCallback(async () => {
    update((current) => ({ ...current, status: 'paused', toast: null }));
    await play();
  }, [play, update]);

  useEffect(() => {
    if (location.pathname !== '/calm' || !track.src) return;
    const audio = new Audio();
    audio.preload = 'metadata';
    audio.volume = 0.75;
    audio.src = track.src;
    audioRef.current = audio;
    let stallTimeout = 0;
    const onMetadata = () => {
      if (Number.isFinite(audio.duration) && audio.duration > 0) {
        update((current) => ({ ...current, duration: audio.duration }));
      }
    };
    const onTime = () => update((current) => ({ ...current, currentTime: audio.currentTime }));
    const onEnded = () => {
      ambientRef.current?.pause();
      update((current) => ({ ...current, currentTime: current.duration, status: 'completed' }));
    };
    const onError = () => update((current) => ({ ...current, status: 'error' }));
    const onWaiting = () => {
      window.clearTimeout(stallTimeout);
      stallTimeout = window.setTimeout(onError, 8000);
    };
    const onReady = () => window.clearTimeout(stallTimeout);
    audio.addEventListener('loadedmetadata', onMetadata);
    audio.addEventListener('timeupdate', onTime);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('error', onError);
    audio.addEventListener('waiting', onWaiting);
    audio.addEventListener('playing', onReady);
    audio.addEventListener('canplay', onReady);
    return () => {
      window.clearTimeout(stallTimeout);
      audio.pause();
      audio.removeAttribute('src');
      audio.load();
      audioRef.current = null;
      ambientRef.current?.pause();
      ambientRef.current = null;
    };
  }, [location.pathname, track.id, track.src, update]);

  useEffect(() => {
    if (state.status !== 'playing') return;
    const timer = window.setInterval(() => {
      const current = stateRef.current;
      const nextTime = track.src
        ? (audioRef.current?.currentTime ?? current.currentTime)
        : Math.min(current.duration, current.currentTime + 1);
      const nextRemaining = current.sleepTimerMin ? current.timerRemaining - 1 : 0;
      if (current.sleepTimerMin && nextRemaining <= 0) {
        audioRef.current?.pause();
        ambientRef.current?.pause();
        update((latest) => ({
          ...latest,
          status: 'paused',
          currentTime: nextTime,
          sleepTimerMin: 0,
          timerRemaining: 0,
          toast: 'Timer finished.',
        }));
      } else if (nextTime >= current.duration) {
        audioRef.current?.pause();
        ambientRef.current?.pause();
        update((latest) => ({ ...latest, status: 'completed', currentTime: latest.duration }));
      } else {
        update((latest) => ({ ...latest, currentTime: nextTime, timerRemaining: nextRemaining }));
      }
    }, 1000);
    return () => window.clearInterval(timer);
  }, [state.status, track.id, track.src, update]);

  useEffect(() => {
    writeSession(AUDIO_POSITION_KEY, { trackId: track.id, currentTime: state.currentTime });
  }, [track.id, state.currentTime]);

  useEffect(() => {
    update((current) => ({ ...current, ambientOn: preferences.ambientOn }));
  }, [preferences.ambientOn, update]);

  useEffect(() => {
    const previous = previousPath.current;
    const autoplay = Boolean((location.state as { autoplay?: boolean } | null)?.autoplay);
    if (previous === '/calm' && location.pathname !== '/calm') {
      resumeOnReturn.current =
        stateRef.current.status === 'playing' || stateRef.current.status === 'loading';
      pause();
    } else if (previous !== '/calm' && location.pathname === '/calm') {
      if (autoplay) {
        resumeOnReturn.current = false;
        void play();
      } else if (resumeOnReturn.current) {
        resumeOnReturn.current = false;
        void play();
      }
    }
    previousPath.current = location.pathname;
  }, [location.pathname, location.state, pause, play]);

  const dismissToast = useCallback(
    () => update((current) => ({ ...current, toast: null })),
    [update],
  );
  const togglePlayback = useCallback(() => {
    if (stateRef.current.status === 'playing') pause();
    else void play();
  }, [pause, play]);

  return (
    <AudioContext.Provider
      value={{
        ...state,
        track,
        play,
        pause,
        togglePlayback,
        seek,
        setAmbient,
        cycleSleepTimer,
        dismissToast,
        retry,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
}

export function useAudio() {
  const value = useContext(AudioContext);
  if (!value) throw new Error('useAudio must be used within AudioProvider');
  return value;
}
