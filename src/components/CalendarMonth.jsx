import React, { useMemo, memo } from 'react';
import { Image, Text, View } from 'react-native';
import { getStreakColor, toDateKey, getWorkoutEmoji } from '../utils/constants';

function getMonthGrid(year, monthIndex) {
  const first = new Date(year, monthIndex, 1);
  const startDay = first.getDay();
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < startDay; i += 1) cells.push(null);
  for (let d = 1; d <= daysInMonth; d += 1) cells.push(new Date(year, monthIndex, d));
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

function CalendarMonth({ posts, monthDate, onSelectDay }) {
  const date = monthDate ? new Date(monthDate) : new Date();
  const year = date.getFullYear();
  const monthIndex = date.getMonth();
  const cells = useMemo(() => getMonthGrid(year, monthIndex), [year, monthIndex]);

  const postsByDay = useMemo(() => {
    const map = {};
    posts.forEach((p) => {
      const key = toDateKey(p.createdAt);
      if (!map[key]) {
        map[key] = [];
      }
      map[key].push(p);
    });
    
    // Sort posts within each day by creation time (oldest first)
    Object.keys(map).forEach(key => {
      map[key].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    });
    
    return map;
  }, [posts]);

  return (
    <View style={{ paddingHorizontal: 12 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
        <Text style={{ color: '#9ca3af' }}>{date.toLocaleString(undefined, { month: 'long', year: 'numeric' })}</Text>
      </View>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
        {cells.map((d, idx) => {
          if (!d) return <View key={idx} style={{ width: '14.2857%', aspectRatio: 0.85, padding: 1 }} />;
          const key = toDateKey(d);
          const dayPosts = postsByDay[key] ?? [];
          const firstPost = dayPosts[0]; // This is now the chronologically first post for the day
          
          // Use streak directly from post data
          const borderColor = firstPost ? getStreakColor(firstPost.streak) : 'transparent';
          
          return (
            <View key={key} style={{ width: '14.2857%', aspectRatio: 0.85, padding: 1 }}>
              <View style={{ flex: 1, borderRadius: 6, borderWidth: firstPost ? 2 : 1, borderColor: firstPost ? borderColor : '#1f2937', overflow: 'hidden', backgroundColor: '#0b0f14' }}>
                {firstPost ? (
                  <Image 
                    source={typeof firstPost.imageUri === 'string' ? { uri: firstPost.imageUri } : firstPost.imageUri} 
                    style={{ width: '100%', height: '100%' }} 
                    resizeMode="cover"
                    resizeMethod="resize"
                    fadeDuration={0}
                  />
                ) : null}
                <View style={{ position: 'absolute', top: 4, right: 4, backgroundColor: '#00000080', paddingHorizontal: 4, borderRadius: 4 }}>
                  <Text style={{ color: 'white', fontSize: 10 }}>{d.getDate()}</Text>
                </View>
                {firstPost && (
                  <View style={{ position: 'absolute', bottom: 4, left: 4 }}>
                    <Text style={{ fontSize: 14 }}>{getWorkoutEmoji(firstPost.tag)}</Text>
                  </View>
                )}
              </View>
              <View style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0 }} pointerEvents="box-none">
                <View style={{ flex: 1 }}
                  onStartShouldSetResponder={() => true}
                  onResponderRelease={() => onSelectDay && firstPost && onSelectDay(firstPost.id)}
                />
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
}

export default memo(CalendarMonth);


