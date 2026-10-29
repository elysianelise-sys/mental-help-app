import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import pricing from '../../data/mock/pricing.json';
import faqs from '../../data/mock/faqs.json';
import AppHeader from '../../components/layout/AppHeader';
import { Icon } from '../../components/ui/Icon';
import { SessionCompanion } from '../../mascot/Mascot';
import { useReducedMotionPref } from '../../providers/PreferencesProvider';
import { usePurchases } from '../../providers/PurchaseProvider';
import styles from './BuySessionsPage.module.css';

type Plan = (typeof pricing)[number];
type Sheet = 'purchase' | 'faq' | null;
const plans = pricing as Plan[];

export default function BuySessionsPage() {
  const [days, setDays] = useState(4);
  const [sheet, setSheet] = useState<Sheet>(null);
  const [purchaseState, setPurchaseState] = useState<'confirm' | 'success' | 'error'>('confirm');
  const [bubbleStraight, setBubbleStraight] = useState(false);
  const { reduced } = useReducedMotionPref();
  const { addPurchase } = usePurchases();
  const navigate = useNavigate();
  const sheetRef = useRef<HTMLElement>(null);
  const restoreFocusRef = useRef<HTMLElement | null>(null);
  const selectedPlan = useMemo(() => plans.find((plan) => plan.days === days) ?? plans[1], [days]);
  const discount = Math.round((1 - selectedPlan.price / selectedPlan.original) * 100);

  const goBack = () => navigate('/home');

  const openSheet = (nextSheet: Exclude<Sheet, null>) => {
    restoreFocusRef.current = document.activeElement as HTMLElement | null;
    if (nextSheet === 'purchase') setPurchaseState('confirm');
    setSheet(nextSheet);
  };

  const closeSheet = () => setSheet(null);

  useEffect(() => {
    if (!sheet) return;
    const previousOverflow = document.body.style.overflow;
    const panel = sheetRef.current;
    const focusable = () =>
      Array.from(
        panel?.querySelectorAll<HTMLElement>(
          'button:not([disabled]), a[href], input:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ) ?? [],
      );
    document.body.style.overflow = 'hidden';
    panel?.focus({ preventScroll: true });
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeSheet();
        return;
      }
      if (event.key !== 'Tab') return;
      const items = focusable();
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKeyDown);
      restoreFocusRef.current?.focus({ preventScroll: true });
    };
  }, [sheet]);

  const confirmPurchase = () => {
    const saved = addPurchase({
      days,
      original: selectedPlan.original,
      price: selectedPlan.price,
      discount,
    });
    setPurchaseState(saved ? 'success' : 'error');
  };

  return (
    <>
      <AppHeader title="Sessions" back onBackClick={goBack} />
      <main className={styles.page}>
        <div className={styles.pageTitleRow}>
          <h2>Buy Sessions</h2>
          <button
            type="button"
            className={styles.helpButton}
            aria-label="Help & FAQ"
            onClick={() => openSheet('faq')}
          >
            <Icon name="help" size={18} />
          </button>
        </div>

        <section
          className={styles.hero}
          aria-label="Session companion"
          onMouseEnter={() => setBubbleStraight(true)}
          onMouseLeave={() => setBubbleStraight(false)}
          onPointerDown={(event) => {
            if (
              event.pointerType === 'touch' &&
              event.target instanceof Element &&
              event.target.closest('.session-companion')
            ) {
              setBubbleStraight(true);
            }
          }}
          onPointerUp={() => setBubbleStraight(false)}
          onPointerCancel={() => setBubbleStraight(false)}
        >
          <div className={`${styles.glow} ${styles.glowOne}`} />
          <div className={`${styles.glow} ${styles.glowTwo}`} />
          <div className={`${styles.glow} ${styles.glowThree}`} />
          <motion.div
            className={styles.speechBubble}
            animate={{ rotate: bubbleStraight ? 0 : -8 }}
            transition={reduced ? { duration: 0 } : { type: 'spring', stiffness: 260, damping: 16 }}
          >
            <span className={styles.bubbleIcon}>
              <Icon name="bubbleIcon" size={15} />
            </span>
            <span>Get your mental health in order.</span>
            <i className={styles.bubbleTail} />
          </motion.div>
          <SessionCompanion days={days} />
          <Icon name="sparkleSmall" size={20} className={styles.sparkleOne} />
          <Icon name="sparkleSmall" size={15} className={styles.sparkleTwo} />
          <div className={styles.fogFade} />
        </section>

        <section className={styles.frequency} aria-labelledby="frequency-title">
          <div className={styles.frequencyHeader}>
            <h3 id="frequency-title">Recommended frequency</h3>
            {days === 4 && <span className={styles.optimalBadge}>Optimal Pace</span>}
          </div>
          <div className={styles.waveSlider}>
            <svg viewBox="0 0 334 40" preserveAspectRatio="none" aria-hidden="true">
              <defs>
                <clipPath id="frequency-wave-fill">
                  <rect width={`${((days - 3) / 5) * 334}`} height="40" />
                </clipPath>
              </defs>
              <path
                d="M2 22 C32 20 39 6 70 10 S112 34 143 26 S183 10 213 15 S263 34 292 24 S320 13 332 16"
                fill="none"
                stroke="#FAD6E9"
                strokeWidth="4"
                strokeLinecap="round"
              />
              <path
                d="M2 22 C32 20 39 6 70 10 S112 34 143 26 S183 10 213 15 S263 34 292 24 S320 13 332 16"
                fill="none"
                stroke="#F29BB0"
                strokeWidth="4"
                strokeLinecap="round"
                clipPath="url(#frequency-wave-fill)"
              />
            </svg>
            <input
              aria-label="Recommended frequency in days"
              aria-valuetext={`${days} days`}
              type="range"
              min={3}
              max={8}
              step={1}
              value={days}
              onChange={(event) => setDays(Number(event.currentTarget.value))}
              style={{ '--slider-progress': `${((days - 3) / 5) * 100}%` } as CSSProperties}
            />
          </div>
        </section>

        <div className={styles.dayStrip} role="radiogroup" aria-label="Package length">
          {plans.map((plan) => (
            <button
              type="button"
              key={plan.days}
              role="radio"
              aria-checked={days === plan.days}
              className={`${styles.dayButton}${days === plan.days ? ` ${styles.selectedDay}` : ''}`}
              onClick={() => setDays(plan.days)}
            >
              <span className={styles.dayNumber}>{plan.days}</span>
              {days === plan.days && <i className={styles.dayDot} />}
              <span className={styles.dayLabel}>Days</span>
            </button>
          ))}
        </div>

        <div className={styles.assurance}>
          <span>
            <Icon name="shieldCheck" size={17} /> Licensed therapist
          </span>
          <i aria-hidden="true">•</i>
          <span>
            <Icon name="lock" size={16} /> Confidential &amp; safe
          </span>
        </div>

        <section className={styles.checkoutCard} aria-label="Plan price">
          <div className={styles.checkoutTotal}>
            <div>
              <span className={styles.totalLabel}>Total</span>
              <del>${selectedPlan.original}</del>
            </div>
            <strong>${selectedPlan.price}</strong>
            <span className={styles.discountBadge}>
              <Icon name="discountTag" size={14} /> −{discount}%
            </span>
          </div>
          <p className={styles.discountCopy}>Discount applied</p>
          <button type="button" className={styles.buyButton} onClick={() => openSheet('purchase')}>
            <Icon name="bag" size={19} />
            <span>Buy Now</span>
          </button>
        </section>
      </main>

      {sheet && (
        <div
          className={styles.sheetOverlay}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeSheet();
          }}
        >
          <section
            ref={sheetRef}
            className={styles.sheet}
            role="dialog"
            aria-modal="true"
            aria-labelledby="sheet-title"
            tabIndex={-1}
          >
            <header className={styles.sheetHeader}>
              <h2
                id="sheet-title"
                aria-live={
                  sheet === 'purchase' && purchaseState === 'success' ? 'polite' : undefined
                }
              >
                {sheet === 'faq'
                  ? 'Help & FAQ'
                  : purchaseState === 'success'
                    ? "You're booked in."
                    : 'Confirm your plan'}
              </h2>
              <button
                type="button"
                className={styles.sheetClose}
                aria-label="Close"
                onClick={closeSheet}
              >
                <Icon name="close" size={14} />
              </button>
            </header>
            {sheet === 'purchase' &&
              (purchaseState === 'success' ? (
                <div className={styles.sheetBody}>
                  <p role="status">We'll be in touch with next steps.</p>
                </div>
              ) : purchaseState === 'error' ? (
                <div className={styles.sheetBody}>
                  <p role="alert">
                    Something went wrong with your booking. You haven't been charged.
                  </p>
                  <button type="button" className={styles.confirmButton} onClick={confirmPurchase}>
                    Try again
                  </button>
                </div>
              ) : (
                <div className={styles.sheetBody}>
                  <p>
                    {days}-day plan · ${selectedPlan.price}
                  </p>
                  <div className={styles.sheetActions}>
                    <button
                      type="button"
                      className={styles.confirmButton}
                      onClick={confirmPurchase}
                    >
                      Confirm
                    </button>
                  </div>
                </div>
              ))}
            {sheet === 'faq' && (
              <div className={styles.faqList}>
                {faqs.map((item) => (
                  <details key={item.question}>
                    <summary>{item.question}</summary>
                    <p>{item.answer}</p>
                  </details>
                ))}
              </div>
            )}
          </section>
        </div>
      )}
    </>
  );
}
