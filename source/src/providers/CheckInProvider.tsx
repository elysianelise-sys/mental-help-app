import { createContext, useContext, useReducer, type ReactNode } from 'react';
import type { EmotionKey } from '../mascot/emotions';
import { read, write } from '../data/storage';
export type Influence =
  'sleep' | 'meditation' | 'work' | 'family' | 'health' | 'social' | 'finances' | 'nature';
export type CheckIn = {
  id: string;
  createdAt: string;
  emotion: EmotionKey;
  influences: Influence[];
  note?: string;
};
type State = { history: CheckIn[]; storageError: boolean };
type Action = { type: 'replace'; history: CheckIn[] } | { type: 'dismiss-storage-error' };
const KEY = 'mh.checkins.v1';
function reducer(state: State, action: Action): State {
  return action.type === 'replace'
    ? { ...state, history: action.history }
    : action.type === 'dismiss-storage-error'
      ? { ...state, storageError: false }
      : state;
}
function initialState(): State {
  let storageError = false;
  let history = read<CheckIn[]>(KEY, [], () => {
    storageError = true;
  });
  const seeded = read<boolean>('mh.demoSeed.v1', false);
  if (!seeded) {
    if (history.length === 0) {
      const today = new Date();
      const monday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      monday.setDate(monday.getDate() - ((monday.getDay() + 6) % 7));
      const sampleEmotions = ['calm', 'calm', 'neutral', 'calm', 'calm'] as const;
      history = sampleEmotions.map((emotion, index) => {
        const date = new Date(monday);
        date.setDate(monday.getDate() + index);
        date.setHours(12, 0, 0, 0);
        return {
          id: `demo-${date.toISOString().slice(0, 10)}`,
          createdAt: localISODateTime(date),
          emotion,
          influences: [],
        };
      });
      if (!write(KEY, history)) storageError = true;
    }
    if (!write('mh.demoSeed.v1', true)) storageError = true;
  }
  return { history, storageError };
}
type ContextValue = {
  history: CheckIn[];
  storageError: boolean;
  dismissStorageError: () => void;
  addCheckIn: (checkIn: CheckIn) => void;
  clear: () => void;
};
const CheckInContext = createContext<ContextValue | undefined>(undefined);
export function CheckInProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, initialState);
  const addCheckIn = (entry: CheckIn) => {
    const next = [...state.history, entry];
    if (!write(KEY, next)) throw new Error('Could not save check-in');
    dispatch({ type: 'replace', history: next });
  };
  const clear = () => {
    if (!write<CheckIn[]>(KEY, []) || !write('mh.demoSeed.v1', true)) {
      throw new Error('Could not clear check-ins');
    }
    dispatch({ type: 'replace', history: [] });
  };
  return (
    <CheckInContext.Provider
      value={{
        history: state.history,
        storageError: state.storageError,
        dismissStorageError: () => dispatch({ type: 'dismiss-storage-error' }),
        addCheckIn,
        clear,
      }}
    >
      {children}
    </CheckInContext.Provider>
  );
}
export function useCheckIns() {
  const value = useContext(CheckInContext);
  if (!value) throw new Error('useCheckIns must be used within CheckInProvider');
  return value;
}
export function localISODateTime(date = new Date()) {
  const offset = -date.getTimezoneOffset();
  const sign = offset >= 0 ? '+' : '-';
  const hours = String(Math.floor(Math.abs(offset) / 60)).padStart(2, '0');
  const minutes = String(Math.abs(offset) % 60).padStart(2, '0');
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}.${String(date.getMilliseconds()).padStart(3, '0')}${sign}${hours}:${minutes}`;
}
