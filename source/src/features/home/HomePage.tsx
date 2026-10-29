import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppHeader from '../../components/layout/AppHeader';
import { Icon } from '../../components/ui/Icon';
import { Orb } from '../../mascot/Mascot';
import { read, write } from '../../data/storage';
import { getWeeklyMood } from '../../data/homeSelectors';
import user from '../../data/mock/user.json';
// These Energy and Stress numbers are static sample values from the mock data.
import insights from '../../data/mock/insights.json';
import { useCheckIns } from '../../providers/CheckInProvider';
import { useDragScroll } from '../../hooks/useDragScroll';
import styles from './HomePage.module.css';

const REMINDER = 'Take three deep breaths before your next task.';
const dateKey = (date = new Date()) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

export default function HomePage() {
  const navigate = useNavigate();
  const { history } = useCheckIns();
  const [toast, setToast] = useState<{ message: string; action?: string } | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [featuredPage, setFeaturedPage] = useState(0);
  const featuredRef = useRef<HTMLElement>(null);
  const featuredDrag = useDragScroll<HTMLElement>({ snap: true });
  const [reminderDismissed, setReminderDismissed] = useState(
    () => read<Record<string, boolean>>('mh.reminders.v1', {})[dateKey()] === true,
  );
  const [notificationsRead, setNotificationsRead] = useState(
    () => read<string>('mh.notificationsSeen.v1', '') === dateKey(),
  );
  const closeButton = useRef<HTMLButtonElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);
  const weekly = getWeeklyMood(history);
  const latestEmotion = history.reduce((latest, entry) =>
    new Date(entry.createdAt) > new Date(latest.createdAt) ? entry : latest,
  history[0])?.emotion ?? 'calm';

  useEffect(() => {
    if (sheetOpen) {
      previousFocus.current = document.activeElement as HTMLElement;
      closeButton.current?.focus();
      return () => previousFocus.current?.focus();
    }
  }, [sheetOpen]);
  useEffect(() => {
    if (!toast) return;
    const timeout = window.setTimeout(() => setToast(null), 3200);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  function showToast(message: string, action?: string) {
    setToast({ message, action });
  }
  function dismissReminder() {
    const dismissed = read<Record<string, boolean>>('mh.reminders.v1', {});
    dismissed[dateKey()] = true;
    write('mh.reminders.v1', dismissed);
    setReminderDismissed(true);
    showToast('Nice. Reminder done for today.', 'Undo');
  }
  function undoDismissal() {
    const dismissed = read<Record<string, boolean>>('mh.reminders.v1', {});
    delete dismissed[dateKey()];
    write('mh.reminders.v1', dismissed);
    setReminderDismissed(false);
    setToast(null);
  }
  function openNotifications() {
    write('mh.notificationsSeen.v1', dateKey());
    setNotificationsRead(true);
    setSheetOpen(true);
  }

  return (
    <>
      <AppHeader title="Home" home />
      <main className={styles.home}>
        <section className={styles.greeting} aria-label="Greeting">
          <div>
            <p>Hello,</p>
            <h2>
              {user.firstName}
              <span className={styles.greetingMark}>
                <Orb emotion={history.length ? latestEmotion : 'calm'} size={22} />
              </span>
            </h2>
          </div>
          <div className={styles.quickActions}>
            <button
              className={styles.roundAction}
              aria-label="Calendar"
              onClick={() => navigate('/calendar')}
            >
              <Icon name="calendar" size={20} />
            </button>
            <button
              className={styles.roundAction}
              aria-label={`Notifications${notificationsRead ? '' : ', 1 unread'}`}
              onClick={openNotifications}
            >
              <Icon name="bell" size={20} />
              {!notificationsRead && <span className={styles.unreadDot} />}
            </button>
          </div>
        </section>

        <section
          ref={featuredRef}
          className={styles.featured}
          aria-label="Featured"
          onScroll={(event) =>
            setFeaturedPage(
              Math.round(event.currentTarget.scrollLeft / featuredDrag.step(event.currentTarget)),
            )
          }
          {...featuredDrag.props}
        >
          <article
            className={`${styles.featureCard} ${styles.selfCare}`}
            tabIndex={0}
            aria-label="Self Care, daily reflection"
          >
            <span className={styles.eyebrow}>SELF CARE</span>
            <h2>Keep your head up.</h2>
            <div className={styles.featureBottom}>
              <span>Daily reflection</span>
              <button aria-label="Open daily reflection" onClick={() => navigate('/check-in')}>
                <Icon name="arrowRight" size={20} />
              </button>
            </div>
          </article>
          <article
            className={`${styles.featureCard} ${styles.evening}`}
            tabIndex={0}
            aria-label="Evening Calm, 10 min audio"
          >
            <span className={styles.eyebrow}>EVENING CALM</span>
            <h2>
              Unwind
              <br />
              gently.
            </h2>
            <div className={styles.featureBottom}>
              <span>10 min audio</span>
              <button
                aria-label="Play Evening Calm"
                onClick={() => navigate('/calm', { state: { autoplay: true } })}
              >
                <Icon name="play" size={16} />
              </button>
            </div>
          </article>
        </section>
        <div className={styles.featuredDots}>
          {[0, 1].map((page) => (
            <button
              key={page}
              type="button"
              aria-label={`Show card ${page + 1} of 2`}
              aria-current={featuredPage === page}
              className={featuredPage === page ? styles.dotActive : undefined}
              onClick={() =>
                featuredRef.current?.scrollTo({
                  left: page * featuredDrag.step(featuredRef.current),
                  behavior: 'smooth',
                })
              }
            />
          ))}
        </div>

        <section className={styles.weekSection}>
          <div className={styles.sectionHeading}>
            <h2>Your week at a glance</h2>
            <button
              className={styles.textLink}
              onClick={() => showToast('Insights are coming soon.')}
            >
              Insights <Icon name="chevronRight" size={14} />
            </button>
          </div>
          <article className={styles.moodCard}>
            <header className={styles.moodHeader}>
              <div className={styles.moodTitle}>
                <span className={styles.pinkDot} />
                <h3>Weekly Mood</h3>
              </div>
              {!weekly.empty && <span className={styles.topMoodPill}>TOP MOOD</span>}
            </header>
            {weekly.empty ? (
              <div className={styles.emptyMood}>
                <strong>No check-ins yet</strong>
                <span>Check in once a day to see your week take shape.</span>
              </div>
            ) : (
              <div className={styles.moodSummary}>
                <div>
                  <strong>{weekly.topMood}</strong>
                  <span className={styles.streakText}>
                    {weekly.streak === 0
                      ? 'Check in today to start a streak.'
                      : weekly.streak === 1
                        ? '1 day'
                        : `Consistent for ${weekly.streak} consecutive days`}
                  </span>
                </div>
                <div
                  className={styles.gauge}
                  role="img"
                  aria-label={`${Math.round(weekly.progress * 100)}% of days so far with a check-in`}
                >
                  <svg viewBox="0 0 100 58" aria-hidden="true">
                    <path className={styles.gaugeOuter} d="M 8 52 A 42 42 0 0 1 92 52" />
                    <path className={styles.gaugeInner} d="M 19 52 A 31 31 0 0 1 81 52" />
                    <path
                      className={styles.gaugeProgress}
                      d="M 8 52 A 42 42 0 0 1 92 52"
                      pathLength="100"
                      strokeDasharray={`${weekly.progress * 100} 100`}
                    />
                    <circle
                      cx={50 - 42 * Math.cos(Math.PI * weekly.progress)}
                      cy={52 - 42 * Math.sin(Math.PI * weekly.progress)}
                      r="4"
                      fill="var(--brand-deep)"
                      stroke="white"
                      strokeWidth="1.5"
                    />
                  </svg>
                </div>
              </div>
            )}
            <div className={styles.dayRow} aria-label="This week's check-ins">
              {weekly.days.map((day) => (
                <div className={`${styles.day} ${day.isToday ? styles.today : ''}`} key={day.label}>
                  <span
                    className={`${styles.dayDot} ${day.checkIn ? styles.hasCheckin : ''} ${day.isToday ? styles.todayDot : ''} ${day.isFuture ? styles.future : ''}`}
                  />
                  <span>{day.label}</span>
                </div>
              ))}
            </div>
          </article>

          <div className={styles.metrics}>
            <button
              className={styles.metricCard}
              onClick={() => showToast('Energy details are coming soon.')}
            >
              <span className={`${styles.metricIcon} ${styles.energyIcon}`}>
                <Icon name="energy" size={17} />
              </span>
              <span className={styles.metricTitle}>Energy</span>
              <Icon className={styles.metricArrow} name="chevronRight" size={14} />
              <strong>{insights.energy.value}</strong>
              <span className={styles.metricTrend}>
                <Icon name="trendUp" size={14} />
                {insights.energy.trend}
              </span>
              <span className={styles.metricProgress}>
                <i style={{ width: `${insights.energy.value}%` }} />
              </span>
            </button>
            <button
              className={`${styles.metricCard} ${styles.stressCard}`}
              onClick={() => showToast('Stress details are coming soon.')}
            >
              <span className={`${styles.metricIcon} ${styles.stressIcon}`}>
                <Icon name="stress" size={17} />
              </span>
              <span className={styles.metricTitle}>Stress</span>
              <Icon className={styles.metricArrow} name="chevronRight" size={14} />
              <strong>{insights.stress.value}</strong>
              <span className={styles.metricTrend}>
                <Icon name="trendDown" size={14} />
                {insights.stress.trend}
              </span>
              <span className={styles.metricProgress}>
                <i style={{ width: `${insights.stress.value}%` }} />
              </span>
            </button>
          </div>
        </section>

        {!reminderDismissed && (
          <article className={styles.reminder}>
            <button className={styles.reminderBody} onClick={() => navigate('/calm')}>
              <span className={styles.reminderOrb}>
                <Orb size={38} emotion="calm" />
              </span>
              <span className={styles.reminderCopy}>
                <strong>Gentle reminder</strong>
                <span>{REMINDER}</span>
              </span>
            </button>
            <button
              className={styles.dismissButton}
              aria-label="Mark reminder as done"
              onClick={dismissReminder}
            >
              <Icon name="check" size={17} />
            </button>
          </article>
        )}
      </main>

      {toast && (
        <div className={styles.toast} role="status">
          <span>{toast.message}</span>
          {toast.action && <button onClick={undoDismissal}>{toast.action}</button>}
        </div>
      )}
      {sheetOpen && (
        <div
          className={styles.sheetBackdrop}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setSheetOpen(false);
          }}
        >
          <section
            className={styles.sheet}
            role="dialog"
            aria-modal="true"
            aria-labelledby="notifications-title"
            onKeyDown={(event) => {
              if (event.key === 'Escape') setSheetOpen(false);
              if (event.key === 'Tab') {
                event.preventDefault();
                closeButton.current?.focus();
              }
            }}
          >
            <div className={styles.sheetHandle} />
            <div className={styles.sheetHeading}>
              <h2 id="notifications-title">Notifications</h2>
              <button
                ref={closeButton}
                aria-label="Close notifications"
                onClick={() => setSheetOpen(false)}
              >
                <Icon name="close" size={14} />
              </button>
            </div>
            {!reminderDismissed ? (
              <p className={styles.notificationItem}>
                <span className={styles.pinkDot} />
                {REMINDER}
              </p>
            ) : (
              <p className={styles.caughtUp}>You're all caught up.</p>
            )}
          </section>
        </div>
      )}
    </>
  );
}
