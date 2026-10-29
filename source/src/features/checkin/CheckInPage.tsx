import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import AppHeader from '../../components/layout/AppHeader';
import { Icon } from '../../components/ui/Icon';
import { EMOTIONS, type EmotionKey } from '../../mascot/emotions';
import { EmotionBadge, MoodOrb } from '../../mascot/Mascot';
import { useReducedMotionPref } from '../../providers/PreferencesProvider';
import { readSession, removeSession, writeSession } from '../../data/storage';
import { localISODateTime, useCheckIns, type Influence } from '../../providers/CheckInProvider';
import styles from './CheckIn.module.css';

type Draft = { emotion: EmotionKey | null; influences: Influence[]; note: string };
const DRAFT_KEY = 'mh.checkin-draft.v1';
const EMPTY_DRAFT: Draft = { emotion: null, influences: [], note: '' };
const tagOptions: { key: Influence; label: string; icon: Parameters<typeof Icon>[0]['name'] }[] = [
  { key: 'sleep', label: 'Sleep', icon: 'tagSleep' },
  { key: 'meditation', label: 'Meditation', icon: 'tagMeditation' },
  { key: 'work', label: 'Work', icon: 'tagWork' },
  { key: 'family', label: 'Family', icon: 'tagFamily' },
  { key: 'health', label: 'Health', icon: 'tagHealth' },
  { key: 'social', label: 'Social', icon: 'tagSocial' },
  { key: 'finances', label: 'Finances', icon: 'tagFinances' },
  { key: 'nature', label: 'Nature', icon: 'tagNature' },
];
function loadDraft(): Draft {
  const value = readSession<Partial<Draft>>(DRAFT_KEY, EMPTY_DRAFT);
  const emotion = EMOTIONS.some((item) => item.key === value?.emotion)
    ? (value.emotion as EmotionKey)
    : null;
  const allowed = tagOptions.map((item) => item.key);
  return {
    emotion,
    influences: Array.isArray(value?.influences)
      ? value.influences.filter((tag): tag is Influence => allowed.includes(tag as Influence))
      : [],
    note: typeof value?.note === 'string' ? value.note.slice(0, 500) : '',
  };
}
function localMoodCopy(emotion: EmotionKey | null) {
  return emotion ? EMOTIONS.find((item) => item.key === emotion)! : null;
}
export default function CheckInPage() {
  const navigate = useNavigate();
  const { reduced } = useReducedMotionPref();
  const { addCheckIn, storageError, dismissStorageError } = useCheckIns();
  const [draft, setDraft] = useState(loadDraft);
  const [step, setStep] = useState<1 | 2>(1);
  const [settled, setSettled] = useState(false);
  const [leaveOpen, setLeaveOpen] = useState(false);
  const [saveError, setSaveError] = useState(false);
  const leaveTrigger = useRef<HTMLElement | null>(null);
  const skipDraftWrite = useRef(false);
  const pendingNavigation = useRef<(() => void) | null>(null);
  const keepEditingRef = useRef<HTMLButtonElement>(null);
  const { emotion, influences, note } = draft;
  const dirty = !!emotion || influences.length > 0 || note.length > 0;
  const selected = localMoodCopy(emotion);
  useEffect(() => {
    if (!leaveOpen) return;
    keepEditingRef.current?.focus();
    const key = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        setLeaveOpen(false);
        return;
      }
      if (event.key === 'Tab') {
        const root = document.querySelector<HTMLElement>('[data-leave-dialog]');
        const targets = root?.querySelectorAll<HTMLElement>('button:not([disabled])');
        if (!targets?.length) return;
        const first = targets[0],
          last = targets[targets.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener('keydown', key);
    return () => document.removeEventListener('keydown', key);
  }, [leaveOpen]);
  useEffect(() => {
    if (leaveOpen) return;
    leaveTrigger.current?.focus();
    leaveTrigger.current = null;
  }, [leaveOpen]);
  useEffect(() => {
    if (skipDraftWrite.current) {
      skipDraftWrite.current = false;
      return;
    }
    writeSession(DRAFT_KEY, draft);
  }, [draft]);
  useEffect(() => {
    if (!storageError) return;
    const timer = window.setTimeout(dismissStorageError, 5000);
    return () => window.clearTimeout(timer);
  }, [storageError, dismissStorageError]);
  useEffect(() => {
    setSettled(false);
    if (!selected?.settles || step !== 1) return;
    const timer = window.setTimeout(() => setSettled(true), 3500);
    return () => window.clearTimeout(timer);
  }, [emotion, selected?.settles, step]);
  const requestLeave = (trigger: HTMLElement | null, destination: () => void = navigateBack) => {
    if (dirty) {
      leaveTrigger.current = trigger ?? (document.activeElement as HTMLElement);
      pendingNavigation.current = destination;
      setLeaveOpen(true);
    } else destination();
  };
  const navigateBack = () => navigate('/home');
  const toggleInfluence = (key: Influence) =>
    setDraft((current) => ({
      ...current,
      influences: current.influences.includes(key)
        ? current.influences.filter((tag) => tag !== key)
        : [...current.influences, key],
    }));
  const handleEmotionKey = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!['ArrowRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown'].includes(event.key)) return;
    event.preventDefault();
    const radios = Array.from(
      event.currentTarget.querySelectorAll<HTMLButtonElement>('[role="radio"]'),
    );
    if (!radios.length) return;
    const index = radios.indexOf(document.activeElement as HTMLButtonElement);
    const direction = event.key === 'ArrowRight' || event.key === 'ArrowDown' ? 1 : -1;
    const next = (index < 0 ? (direction > 0 ? -1 : 0) : index) + direction;
    const target = radios[(next + radios.length) % radios.length];
    target?.click();
    target?.focus();
  };
  const handleSave = () => {
    if (!emotion) return;
    try {
      addCheckIn({
        id: crypto.randomUUID(),
        createdAt: localISODateTime(),
        emotion,
        influences: [...influences],
        ...(note ? { note } : {}),
      });
      removeSession(DRAFT_KEY);
      setSaveError(false);
      setStep(2);
    } catch {
      setSaveError(true);
    }
  };
  const leave = () => {
    removeSession(DRAFT_KEY);
    skipDraftWrite.current = true;
    setDraft(EMPTY_DRAFT);
    setLeaveOpen(false);
    const destination = pendingNavigation.current ?? navigateBack;
    pendingNavigation.current = null;
    destination();
  };
  return (
    <>
      <AppHeader
        title="Check-in"
        back
        onBackClick={(event) => requestLeave(event.currentTarget)}
        onProfileClick={() =>
          requestLeave(document.activeElement as HTMLElement, () => navigate('/profile'))
        }
      />
      {storageError && (
        <div className={styles.storageToast} role="status">
          We couldn't load your saved check-ins, so we've started fresh.
        </div>
      )}
      {step === 1 ? (
        <>
          <main className={styles.page}>
            <div className={styles.stepRow}>
              <div className={styles.stepLabel}>
                <Icon name="step" size={18} />
                <span>Step 1 of 2</span>
              </div>
              <span className={styles.dailyBadge}>DAILY RITUAL</span>
            </div>
            <div className="step-segments" aria-hidden="true">
              <i className="on" />
              <i />
            </div>
            <section className={styles.question}>
              <h2>How are you feeling right now?</h2>
              <p>Select the companion that best resonates with your headspace today.</p>
            </section>
            <div
              className={styles.carousel}
              role="radiogroup"
              aria-label="How are you feeling right now?"
              onKeyDown={handleEmotionKey}
            >
              {EMOTIONS.map((item) => (
                <EmotionBadge
                  key={item.key}
                  emotion={item.key}
                  selected={emotion === item.key}
                  onSelect={() => setDraft((current) => ({ ...current, emotion: item.key }))}
                  tabIndex={emotion === item.key || (!emotion && item.key === 'joyful') ? 0 : -1}
                />
              ))}
            </div>
            {!emotion && (
              <p className={styles.validationHint}>Choose the companion closest to how you feel.</p>
            )}
            <section className={styles.detailCard} aria-live="polite">
              <div className={styles.detailOrbSlot}>
                {emotion && (
                  <AnimatePresence mode="sync">
                    <motion.div
                      key={emotion}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: reduced ? 0 : 0.4 }}
                    >
                      <MoodOrb emotion={emotion} size={40} settled={settled} />
                    </motion.div>
                  </AnimatePresence>
                )}
              </div>
              <div className={styles.detailText}>
                <h3>{selected?.title ?? 'How are you feeling?'}</h3>
                <p>{selected?.blurb ?? 'Choose the companion closest to how you feel.'}</p>
                {selected?.settles && (
                  <p className={styles.settleCopy}>
                    {settled ? 'Settling into a slower rhythm, breathe with it.' : 'Noticing it…'}
                  </p>
                )}
              </div>
            </section>
            <section className={styles.influences}>
              <h3>What's influencing this feeling?</h3>
              <p>Select all that apply</p>
              <div className={styles.tagGrid}>
                {tagOptions.map((tag) => {
                  const active = influences.includes(tag.key);
                  return (
                    <button
                      type="button"
                      key={tag.key}
                      className={`${styles.tag}${active ? ` ${styles.tagSelected}` : ''}`}
                      aria-pressed={active}
                      onClick={() => toggleInfluence(tag.key)}
                    >
                      <Icon name={tag.icon} size={16} />
                      <span>{tag.label}</span>
                    </button>
                  );
                })}
              </div>
            </section>
            <section className={styles.notes}>
              <label htmlFor="gentle-notes">
                <span>Gentle Notes</span>
                <small>Optional</small>
              </label>
              <textarea
                id="gentle-notes"
                maxLength={500}
                value={note}
                placeholder="Add a gentle thought or reflection..."
                onChange={(event) =>
                  setDraft((current) => ({ ...current, note: event.target.value }))
                }
              />
              {note.length >= 450 && (
                <p className={styles.counter} aria-live="polite">
                  {note.length}/500
                </p>
              )}
              <div className={styles.noteFooter}>Stored only on this device</div>
            </section>
          </main>
          <div className={styles.saveBar}>
            {saveError && (
              <p className={styles.saveError} role="alert">
                Your check-in didn't save. Please try again.
              </p>
            )}
            <button
              className={styles.saveButton}
              type="button"
              disabled={!emotion}
              onClick={handleSave}
            >
              Save Check-In <Icon name="arrowRight" size={20} />
            </button>
          </div>
        </>
      ) : (
        <main className={styles.confirmation}>
          <div className={styles.confirmStep}>
            <div className={styles.stepRow}>
              <div className={styles.stepLabel}>
                <Icon name="step" size={18} />
                <span>Step 2 of 2</span>
              </div>
              <span className={styles.dailyBadge}>DAILY RITUAL</span>
            </div>
            <div className="step-segments" aria-hidden="true">
              <i className="on" />
              <i className="on" />
            </div>
          </div>
          <div className={styles.confirmationOrb}>
            {emotion && <MoodOrb emotion={emotion} size={120} />}
          </div>
          <h2>Check-in saved</h2>
          <p>Thank you for checking in.</p>
          <button type="button" className={styles.saveButton} onClick={() => navigate('/home')}>
            Back to Home
          </button>
        </main>
      )}
      {leaveOpen && (
        <div className={styles.sheetBackdrop}>
          <section
            className={styles.leaveSheet}
            data-leave-dialog
            role="dialog"
            aria-modal="true"
            aria-labelledby="leave-title"
          >
            <h2 id="leave-title">Leave without saving?</h2>
            <div>
              <button
                ref={keepEditingRef}
                type="button"
                className={styles.keepButton}
                onClick={() => setLeaveOpen(false)}
              >
                Keep editing
              </button>
              <button type="button" className={styles.leaveButton} onClick={leave}>
                Leave
              </button>
            </div>
          </section>
        </div>
      )}
    </>
  );
}
