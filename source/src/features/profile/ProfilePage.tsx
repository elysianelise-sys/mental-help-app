import { useEffect, useRef, useState } from 'react';
import AppHeader from '../../components/layout/AppHeader';
import { Icon } from '../../components/ui/Icon';
import samantha from '../../assets/photos/samantha.jpg';
import { useCheckIns } from '../../providers/CheckInProvider';
import { useReducedMotionPref } from '../../providers/PreferencesProvider';
import styles from './ProfilePage.module.css';

type MotionMode = 'system' | 'on' | 'off';

export default function ProfilePage() {
  // Not in Figma – approved addition
  const { mode, setMode, ambientOn, setAmbientOn } = useReducedMotionPref();
  const { clear } = useCheckIns();
  const [confirming, setConfirming] = useState(false);
  const [message, setMessage] = useState('');
  const cancelRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!confirming) return;
    cancelRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setConfirming(false);
        window.setTimeout(() => triggerRef.current?.focus(), 0);
      }
      if (event.key === 'Tab') {
        event.preventDefault();
        (document.activeElement === cancelRef.current
          ? document.getElementById('confirm-clear')
          : cancelRef.current
        )?.focus();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [confirming]);

  const closeConfirmation = () => {
    setConfirming(false);
    window.setTimeout(() => triggerRef.current?.focus(), 0);
  };
  const clearCheckIns = () => {
    try {
      clear();
      setMessage('Check-ins cleared.');
      closeConfirmation();
    } catch {
      setMessage('Could not clear check-ins.');
    }
  };
  const motionModes: MotionMode[] = ['system', 'on', 'off'];

  return (
    <>
      <AppHeader title="Profile" back />
      <main className={styles.page}>
        <section className={`${styles.card} ${styles.identity}`}>
          <img src={samantha} alt="Samantha" />
          <div>
            <h2>Samantha</h2>
          </div>
        </section>

        <section className={styles.card}>
          <div className={styles.settingHeading}>
            <span className={styles.settingIcon}>
              <Icon name="therapist" size={19} />
            </span>
            <div>
              <h2>Reduce motion</h2>
              <p>Overrides your device setting</p>
            </div>
          </div>
          <div className={styles.segmented} role="group" aria-label="Reduce motion">
            {motionModes.map((choice) => (
              <button
                key={choice}
                type="button"
                className={mode === choice ? styles.selected : ''}
                aria-pressed={mode === choice}
                onClick={() => setMode(choice)}
              >
                {choice === 'system' ? 'System' : choice === 'on' ? 'On' : 'Off'}
              </button>
            ))}
          </div>
        </section>

        <section className={styles.card}>
          <div className={styles.settingHeading}>
            <span className={styles.settingIcon}>
              <Icon name="moon" size={19} />
            </span>
            <div>
              <h2>Rain sounds by default</h2>
            </div>
          </div>
          <div
            className={`${styles.segmented} ${styles.twoOptions}`}
            role="group"
            aria-label="Rain sounds by default"
          >
            <button
              type="button"
              className={ambientOn ? styles.selected : ''}
              aria-pressed={ambientOn}
              onClick={() => setAmbientOn(true)}
            >
              On
            </button>
            <button
              type="button"
              className={!ambientOn ? styles.selected : ''}
              aria-pressed={!ambientOn}
              onClick={() => setAmbientOn(false)}
            >
              Off
            </button>
          </div>
        </section>

        <section className={styles.card}>
          <h2 className={styles.sectionTitle}>Check-ins</h2>
          <p className={styles.helper}>Remove saved check-ins from this device.</p>
          <button
            ref={triggerRef}
            className={styles.clearButton}
            type="button"
            onClick={() => setConfirming(true)}
          >
            Clear my check-ins
          </button>
        </section>

        <section className={`${styles.card} ${styles.about}`}>
          <h2>About</h2>
          <p>Mental Help · UI/UX assignment</p>
        </section>
        <span className={styles.visuallyHidden} aria-live="polite">
          {message}
        </span>
      </main>

      {confirming && (
        <div
          className={styles.sheetBackdrop}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeConfirmation();
          }}
        >
          <section
            className={styles.sheet}
            role="dialog"
            aria-modal="true"
            aria-labelledby="clear-title"
            aria-describedby="clear-copy"
          >
            <div className={styles.sheetHandle} />
            <h2 id="clear-title">Clear my check-ins?</h2>
            <p id="clear-copy">This will remove all saved check-ins from this device.</p>
            <button
              ref={cancelRef}
              className={styles.keepButton}
              type="button"
              onClick={closeConfirmation}
            >
              Keep my check-ins
            </button>
            <button
              id="confirm-clear"
              className={styles.confirmButton}
              type="button"
              onClick={clearCheckIns}
            >
              Clear my check-ins
            </button>
          </section>
        </div>
      )}
    </>
  );
}
