import { toDateKey } from './constants';

export function computeDailyPostMap(posts) {
  return posts.reduce((acc, p) => {
    const key = toDateKey(p.createdAt);
    if (!acc[key]) acc[key] = [];
    acc[key].push(p);
    return acc;
  }, {});
}

export function computeCurrentStreak(dailyKeys, today = new Date()) {
  const sorted = [...dailyKeys].sort();
  if (sorted.length === 0) return 0;
  let count = 0;
  let cursor = new Date(today);
  while (true) {
    const key = toDateKey(cursor);
    if (dailyKeys.has(key)) {
      count += 1;
      cursor.setDate(cursor.getDate() - 1);
    } else {
      break;
    }
  }
  return count;
}

export function hasMissedThreeInRow(dailyKeys, today = new Date()) {
  let miss = 0;
  const cursor = new Date(today);
  for (let i = 0; i < 3; i += 1) {
    const key = toDateKey(cursor);
    if (!dailyKeys.has(key)) miss += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return miss === 3;
}

export function hasSuperStreakThisWeek(dailyKeys, today = new Date()) {
  const start = startOfWeek(today);
  const days = Array.from({ length: 7 }).map((_, i) => toDateKey(addDays(start, i)));
  return days.every((k) => dailyKeys.has(k));
}

function startOfWeek(date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day; // Sunday start
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function addDays(date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}


