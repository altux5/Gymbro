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

export function getWorkoutEmoji(tagKey) {
  const emojiMap = {
    pull: '💪',
    push: '🏋️',
    leg: '🦵',
    fullBody: '🦍',
    cardio: '⚡',
    broSplit: '😈',
  };
  return emojiMap[tagKey] ?? '💪';
}

export const STREAK_TIERS = [
  { threshold: 0, color: '#374151', name: 'Beginner' },
  { threshold: 1, color: '#b0c3d9', name: 'Novice' },
  { threshold: 6, color: '#5e98d9', name: 'Intermediate' },
  { threshold: 15, color: '#4b69ff', name: 'Advanced' },
  { threshold: 31, color: '#8847ff', name: 'Expert' },
  { threshold: 50, color: '#d32ce6', name: 'Master' },
  { threshold: 76, color: '#eb4b4b', name: 'Elite' },
  { threshold: 100, color: '#b28a33', name: 'Champion' },
  { threshold: 150, color: '#ade55c', name: 'Legend' },
  { threshold: 300, color: '#fff34f', name: 'Immortal' },
];

export function getStreakTierInfo(streakCount) {
  // Find current tier
  let currentTierIndex = 0;
  for (let i = STREAK_TIERS.length - 1; i >= 0; i--) {
    if (streakCount >= STREAK_TIERS[i].threshold) {
      currentTierIndex = i;
      break;
    }
  }
  
  const currentTier = STREAK_TIERS[currentTierIndex];
  const nextTier = currentTierIndex < STREAK_TIERS.length - 1 ? STREAK_TIERS[currentTierIndex + 1] : null;
  
  // Calculate progress
  let progress = 0;
  if (nextTier) {
    const rangeSize = nextTier.threshold - currentTier.threshold;
    const currentProgress = streakCount - currentTier.threshold;
    progress = Math.min(100, (currentProgress / rangeSize) * 100);
  } else {
    // Max tier reached
    progress = 100;
  }
  
  return {
    currentTier: currentTier.threshold,
    currentTierName: currentTier.name,
    nextTier: nextTier ? nextTier.threshold : null,
    nextTierName: nextTier ? nextTier.name : null,
    currentColor: currentTier.color,
    nextColor: nextTier ? nextTier.color : currentTier.color,
    progress: Math.round(progress),
    isMaxTier: !nextTier,
  };
}

export function toDateKey(date) {
  const d = typeof date === 'string' ? new Date(date) : date;
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}


