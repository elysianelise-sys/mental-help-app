import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppHeader from '../../components/layout/AppHeader';
import { Icon } from '../../components/ui/Icon';
import { EMOTIONS, orbFill } from '../../mascot/emotions';
import { Orb } from '../../mascot/Mascot';
import { useCheckIns, type CheckIn } from '../../providers/CheckInProvider';
import styles from './CalendarPage.module.css';

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const key = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
const monthFormat = new Intl.DateTimeFormat('en-GB', { month: 'long', year: 'numeric' });
const dayFormat = new Intl.DateTimeFormat('en-GB', { weekday: 'long', day: 'numeric', month: 'long' });
const timeFormat = new Intl.DateTimeFormat('en-GB', { hour: 'numeric', minute: '2-digit' });

export default function CalendarPage() {
  const navigate = useNavigate();
  const { history: allHistory } = useCheckIns();
  const today = new Date();
  const history = useMemo(
    () => allHistory.filter((entry) => new Date(entry.createdAt) <= new Date()),
    [allHistory],
  );
  const todayKey = key(today);
  const [month, setMonth] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [selected, setSelected] = useState(todayKey);

  const byDay = useMemo(() => {
    const map = new Map<string, CheckIn[]>();
    for (const entry of history) {
      const day = key(new Date(entry.createdAt));
      map.set(day, [...(map.get(day) ?? []), entry]);
    }
    for (const list of map.values()) {
      list.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    }
    return map;
  }, [history]);

  const lead = (month.getDay() + 6) % 7; // Monday first
  const daysInMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  const cells: (Date | null)[] = [
    ...Array.from({ length: lead }, () => null),
    ...Array.from(
      { length: daysInMonth },
      (_, index) => new Date(month.getFullYear(), month.getMonth(), index + 1),
    ),
  ];
  const isCurrentMonth =
    month.getFullYear() === today.getFullYear() && month.getMonth() === today.getMonth();
  const monthEntries = cells.reduce(
    (total, date) => total + (date ? (byDay.get(key(date))?.length ?? 0) : 0),
    0,
  );
  const monthDays = cells.filter((date) => date && byDay.has(key(date))).length;
  const shift = (delta: number) => {
    const next = new Date(month.getFullYear(), month.getMonth() + delta, 1);
    setMonth(next);
    const stillToday = next.getFullYear() === today.getFullYear() && next.getMonth() === today.getMonth();
    setSelected(key(stillToday ? today : next));
  };

  const selectedDate = new Date(
    Number(selected.slice(0, 4)),
    Number(selected.slice(5, 7)) - 1,
    Number(selected.slice(8, 10)),
  );
  const entries = byDay.get(selected) ?? [];

  return (
    <>
      <AppHeader title="Calendar" back />
      <main className={styles.page}>
        <section className={styles.card} aria-label="Month">
          <div className={styles.monthRow}>
            <button type="button" aria-label="Previous month" onClick={() => shift(-1)}>
              <Icon name="back" size={18} />
            </button>
            <h2 aria-live="polite">{monthFormat.format(month)}</h2>
            <button
              type="button"
              aria-label="Next month"
              disabled={isCurrentMonth}
              onClick={() => shift(1)}
              className={styles.next}
            >
              <Icon name="back" size={18} />
            </button>
          </div>
          <p className={styles.summary}>
            {monthEntries
              ? `${monthEntries} ${monthEntries === 1 ? 'check-in' : 'check-ins'} on ${monthDays} ${monthDays === 1 ? 'day' : 'days'}`
              : 'No check-ins this month'}
          </p>

          <div className={styles.grid}>
            {WEEKDAYS.map((day) => (
              <span key={day} className={styles.weekday}>
                {day}
              </span>
            ))}
            {cells.map((date, index) => {
              if (!date) return <span key={`blank-${index}`} />;
              const id = key(date);
              const list = byDay.get(id);
              const latest = list?.[list.length - 1];
              const future = date > today && id !== todayKey;
              const emotion = latest ? EMOTIONS.find((item) => item.key === latest.emotion) : null;
              return (
                <button
                  key={id}
                  type="button"
                  disabled={future}
                  aria-label={`${dayFormat.format(date)}${emotion ? `, ${emotion.label}` : ', no check-in'}`}
                  aria-pressed={selected === id}
                  className={`${styles.day} ${selected === id ? styles.selected : ''} ${id === todayKey ? styles.today : ''}`}
                  onClick={() => setSelected(id)}
                >
                  <span>{date.getDate()}</span>
                  {latest ? (
                    <i className={styles.dot} style={{ background: orbFill(latest.emotion) }} />
                  ) : (
                    <i className={styles.dotEmpty} />
                  )}
                </button>
              );
            })}
          </div>
        </section>

        <section className={styles.card} aria-label="Selected day">
          <h2 className={styles.dayTitle}>
            {selected === todayKey ? 'Today' : dayFormat.format(selectedDate)}
          </h2>
          {entries.length ? (
            <ul className={styles.list}>
              {entries.map((entry) => {
                const emotion = EMOTIONS.find((item) => item.key === entry.emotion);
                return (
                  <li key={entry.id}>
                    <Orb emotion={entry.emotion} size={36} />
                    <div>
                      <strong>{emotion?.label}</strong>
                      <span>
                        {timeFormat.format(new Date(entry.createdAt))}
                        {entry.influences.length ? ` · ${entry.influences.join(', ')}` : ''}
                      </span>
                      {entry.note && <em>{entry.note}</em>}
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className={styles.empty}>
              {selected === todayKey
                ? 'You have not checked in today.'
                : 'No check-in on this day.'}
            </p>
          )}
          {selected === todayKey && (
            <button type="button" className={styles.cta} onClick={() => navigate('/check-in')}>
              Check in now
            </button>
          )}
        </section>
      </main>
    </>
  );
}
