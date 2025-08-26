export const WORKOUT_TAGS = {
  pull: { key: 'pull', label: 'Pull', color: '#b0c3d9' },
  push: { key: 'push', label: 'Push', color: '#5e98d9' },
  leg: { key: 'leg', label: 'Leg', color: '#4b69ff' },
  fullBody: { key: 'fullBody', label: 'Full Body', color: '#8847ff' },
  cardio: { key: 'cardio', label: 'Cardio', color: '#d32ce6' },
  broSplit: { key: 'broSplit', label: 'Bro Split', color: '#eb4b4b' },
};

export const TAG_KEYS = ['pull', 'push', 'leg', 'fullBody', 'cardio', 'broSplit'];

export function getTagColor(tagKey) {
  return WORKOUT_TAGS[tagKey]?.color ?? '#374151';
}

export function getStreakColor(streakCount) {
  if (streakCount >= 300) return '#fff34f';
  if (streakCount >= 150) return '#ade55c';
  if (streakCount >= 100) return '#b28a33';
  if (streakCount >= 76) return '#eb4b4b';
  if (streakCount >= 50) return '#d32ce6';
  if (streakCount >= 31) return '#8847ff';
  if (streakCount >= 15) return '#4b69ff';
  if (streakCount >= 6) return '#5e98d9';
  if (streakCount >= 1) return '#b0c3d9';
  return '#374151'; // default color for no streak
}

export function toDateKey(date) {
  const d = typeof date === 'string' ? new Date(date) : date;
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}


