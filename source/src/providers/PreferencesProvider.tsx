import { createContext, useContext, useEffect, useMemo, useReducer, type ReactNode } from 'react';
import { read, write } from '../data/storage';
type Mode = 'system' | 'on' | 'off';
type PreferenceState = { mode: Mode; ambientOn: boolean };
type Action = { type: 'set-mode'; mode: Mode } | { type: 'set-ambient'; ambientOn: boolean };
const KEY = 'mh.prefs.v1';
const reducer = (state: PreferenceState, action: Action): PreferenceState =>
  action.type === 'set-mode'
    ? { ...state, mode: action.mode }
    : action.type === 'set-ambient'
      ? { ...state, ambientOn: action.ambientOn }
      : state;
const C = createContext<{
  mode: Mode;
  reduced: boolean;
  ambientOn: boolean;
  setMode: (m: Mode) => void;
  setAmbientOn: (enabled: boolean) => void;
}>({
  mode: 'system',
  reduced: false,
  ambientOn: true,
  setMode: () => {},
  setAmbientOn: () => {},
});
export function PreferencesProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, () => {
    const saved = read<Partial<PreferenceState>>(KEY, { mode: 'system', ambientOn: true });
    return { mode: saved.mode ?? 'system', ambientOn: saved.ambientOn ?? true };
  });
  const [system, setSystem] = useReducer((_: boolean, v: boolean) => v, false);
  useEffect(() => {
    const m = matchMedia('(prefers-reduced-motion: reduce)');
    const f = () => setSystem(m.matches);
    f();
    m.addEventListener('change', f);
    return () => m.removeEventListener('change', f);
  }, []);
  const setMode = (mode: Mode) => {
    if (write(KEY, { ...state, mode })) dispatch({ type: 'set-mode', mode });
  };
  const setAmbientOn = (ambientOn: boolean) => {
    if (write(KEY, { ...state, ambientOn })) dispatch({ type: 'set-ambient', ambientOn });
  };
  const value = useMemo(
    () => ({
      mode: state.mode,
      reduced: state.mode === 'on' || (state.mode === 'system' && system),
      ambientOn: state.ambientOn,
      setMode,
      setAmbientOn,
    }),
    [state, system],
  );
  return <C.Provider value={value}>{children}</C.Provider>;
}
export const useReducedMotionPref = () => useContext(C);
