import type { CheckIn } from '../providers/CheckInProvider';
import { EMOTIONS } from '../mascot/emotions';

const dateKey = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

export function getWeekStart(now = new Date()) {
  const monday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  monday.setDate(monday.getDate() - ((monday.getDay() + 6) % 7));
  return monday;
}

export function getWeeklyMood(history: CheckIn[], now = new Date()) {
  const weekStart = getWeekStart(now);
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const todayKey = dateKey(today);
  const latestByDay = new Map<string, CheckIn>();
  const latestAllByDay = new Map<string, CheckIn>();
  for (const entry of history) {
    const created = new Date(entry.createdAt);
    const key = dateKey(created);
    const day = new Date(created.getFullYear(), created.getMonth(), created.getDate());
    if (day > today) continue;
    const existingAll = latestAllByDay.get(key);
    if (!existingAll || new Date(entry.createdAt) > new Date(existingAll.createdAt)) {
      latestAllByDay.set(key, entry);
    }
    if (day >= weekStart) {
      const existing = latestByDay.get(key);
      if (!existing || new Date(entry.createdAt) > new Date(existing.createdAt)) {
        latestByDay.set(key, entry);
      }
    }
  }

  const days = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(weekStart);
    date.setDate(weekStart.getDate() + index);
    return {
      date,
      label: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][index],
      isToday: dateKey(date) === todayKey,
      isFuture: date > today,
      checkIn: latestByDay.get(dateKey(date)),
    };
  });

  const counts = new Map<string, { count: number; latest: number }>();
  for (const entry of latestByDay.values()) {
    const current = counts.get(entry.emotion) ?? { count: 0, latest: 0 };
    current.count += 1;
    current.latest = Math.max(current.latest, new Date(entry.createdAt).getTime());
    counts.set(entry.emotion, current);
  }
  const topKey = [...counts.entries()].sort(
    ([, a], [, b]) => b.count - a.count || b.latest - a.latest,
  )[0]?.[0];
  const topMood = EMOTIONS.find((emotion) => emotion.key === topKey)?.label;

  let streak = 0;
  const cursor = new Date(today);
  if (!latestAllByDay.has(todayKey)) cursor.setDate(cursor.getDate() - 1);
  while (latestAllByDay.has(dateKey(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  const elapsedDays = Math.floor((today.getTime() - weekStart.getTime()) / 86400000) + 1;
  const checkInDays = days.slice(0, elapsedDays).filter((day) => day.checkIn).length;
  return {
    days,
    topMood,
    streak,
    checkInDays,
    elapsedDays,
    progress: elapsedDays ? checkInDays / elapsedDays : 0,
    empty: checkInDays === 0,
  };
}
