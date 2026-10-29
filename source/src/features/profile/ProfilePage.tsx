import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import AppHeader from '../../components/layout/AppHeader';
import { Icon } from '../../components/ui/Icon';
import samantha from '../../assets/photos/samantha.jpg';
import content from '../../data/mock/content.json';
import { read } from '../../data/storage';
import { getWeeklyMood } from '../../data/homeSelectors';
import { EMOTIONS } from '../../mascot/emotions';
import { Orb } from '../../mascot/Mascot';
import { useCheckIns } from '../../providers/CheckInProvider';
import { usePurchases } from '../../providers/PurchaseProvider';
import user from '../../data/mock/user.json';
import styles from './ProfilePage.module.css';

const SAVED_KEY = 'mh.saved.v1';
const dayFormat = new Intl.DateTimeFormat('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
const timeFormat = new Intl.DateTimeFormat('en-GB', { hour: 'numeric', minute: '2-digit' });
const monthFormat = new Intl.DateTimeFormat('en-GB', { month: 'long', year: 'numeric' });

export default function ProfilePage() {
  // Profile shows only what is stored on this device. Settings live on their own page.
  const navigate = useNavigate();
  const { history: allHistory } = useCheckIns();
  // The demo data includes days later this week; only show check-ins that have already happened.
  const history = allHistory.filter((entry) => new Date(entry.createdAt) <= new Date());
  const { purchases } = usePurchases();
  const weekly = getWeeklyMood(history);
  const savedIds = useMemo(() => read<string[]>(SAVED_KEY, []), []);
  const saved = content.filter((item) => savedIds.includes(item.id));

  const recent = [...history]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3);
  const first = history.length
    ? new Date(Math.min(...history.map((entry) => new Date(entry.createdAt).getTime())))
    : null;
  const plan = purchases.length ? purchases[purchases.length - 1] : null;
  const topEmotion = EMOTIONS.find((emotion) => emotion.label === weekly.topMood);

  return (
    <>
      <AppHeader
        title="Profile"
        back
        avatar={false}
        action={
          <button
            type="button"
            className="header-action"
            aria-label="Settings"
            onClick={() => navigate('/settings')}
          >
            <Icon name="settings" size={22} />
          </button>
        }
      />
      <main className={styles.page}>
        <section className={`${styles.card} ${styles.identity}`}>
          <img src={samantha} alt="" />
          <div>
            <h2>{user.firstName}</h2>
            <p>{first ? `Checking in since ${monthFormat.format(first)}` : 'Welcome to Mental Help'}</p>
          </div>
        </section>

        <section className={styles.stats} aria-label="Your numbers">
          <div className={styles.stat}>
            <strong>{history.length}</strong>
            <span>Check-ins</span>
          </div>
          <div className={styles.stat}>
            <strong>{weekly.streak}</strong>
            <span>Day streak</span>
          </div>
          <div className={styles.stat}>
            <strong>{saved.length}</strong>
            <span>Saved</span>
          </div>
        </section>

        <section className={styles.card}>
          <div className={styles.sectionHeading}>
            <h2>This week</h2>
            <button type="button" onClick={() => navigate('/calendar')}>
              Calendar
              <Icon name="chevronRight" size={14} />
            </button>
          </div>
          {topEmotion ? (
            <div className={styles.weekRow}>
              <Orb emotion={topEmotion.key} size={44} />
              <p>
                <strong>Mostly {topEmotion.label.toLowerCase()}</strong>
                <span>
                  {weekly.checkInDays} of {weekly.elapsedDays}{' '}
                  {weekly.elapsedDays === 1 ? 'day' : 'days'} checked in
                </span>
              </p>
            </div>
          ) : (
            <p className={styles.empty}>No check-ins this week yet.</p>
          )}
        </section>

        <section className={styles.card}>
          <div className={styles.sectionHeading}>
            <h2>Recent check-ins</h2>
          </div>
          {recent.length ? (
            <ul className={styles.list}>
              {recent.map((entry) => {
                const emotion = EMOTIONS.find((item) => item.key === entry.emotion);
                const date = new Date(entry.createdAt);
                return (
                  <li key={entry.id}>
                    <Orb emotion={entry.emotion} size={34} />
                    <div>
                      <strong>{emotion?.label}</strong>
                      <span>
                        {dayFormat.format(date)} · {timeFormat.format(date)}
                      </span>
                      {entry.note && <em>{entry.note}</em>}
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className={styles.empty}>Nothing here yet.</p>
          )}
          <button type="button" className={styles.linkButton} onClick={() => navigate('/check-in')}>
            Check in now
          </button>
        </section>

        <section className={styles.card}>
          <div className={styles.sectionHeading}>
            <h2>Saved sessions</h2>
          </div>
          {saved.length ? (
            <ul className={styles.list}>
              {saved.map((item) => (
                <li key={item.id}>
                  <button
                    type="button"
                    className={styles.rowButton}
                    onClick={() => navigate(`/calm?track=${item.id}`)}
                  >
                    <div>
                      <strong>{item.title}</strong>
                      <span>
                        {item.therapist} · {item.duration}
                      </span>
                    </div>
                    <Icon name="arrowRight" size={18} />
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className={styles.empty}>Tap the star on a session in Explore to keep it here.</p>
          )}
          <button type="button" className={styles.linkButton} onClick={() => navigate('/explore')}>
            Browse Explore
          </button>
        </section>

        <section className={styles.card}>
          <div className={styles.sectionHeading}>
            <h2>Your plan</h2>
          </div>
          {plan ? (
            <div className={styles.plan}>
              <strong>{plan.days}-day plan</strong>
              <span>
                ${plan.price} · booked {dayFormat.format(new Date(plan.purchasedAt))}
              </span>
            </div>
          ) : (
            <p className={styles.empty}>No plan booked yet.</p>
          )}
          <button type="button" className={styles.linkButton} onClick={() => navigate('/sessions')}>
            {plan ? 'Book another plan' : 'See session plans'}
          </button>
        </section>
      </main>
    </>
  );
}
