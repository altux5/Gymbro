import React, { useMemo } from 'react';
import { Image, SafeAreaView, Text, View, ScrollView, Pressable } from 'react-native';
import { usePosts } from '../state/PostsContext';
import CalendarMonth from '../components/CalendarMonth';
import { useNavigation } from '@react-navigation/native';
import UnifiedHeader from '../components/UnifiedHeader';
import ProfilePicture from '../components/ProfilePicture';
import StreakProgressBar from '../components/StreakProgressBar';
import ProfileBanner from '../components/ProfileBanner';
import { getStreakTierInfo, getWorkoutEmoji, WORKOUT_TAGS } from '../utils/constants';

export default function MyProfileScreen() {
  const { posts, users } = usePosts();
  const navigation = useNavigation();

  // Always show the current user's profile
  const currentUser = users.me;
  const userPosts = useMemo(() => 
    posts.filter(p => p.userId === currentUser.id).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
    [posts, currentUser.id]
  );

  // Get the highest streak value (final streak) from all posts
  const currentStreak = userPosts.length > 0 ? Math.max(...userPosts.map(p => p.streak)) : 0;
  const streakInfo = getStreakTierInfo(currentStreak);
  
  // Get first gymshot date
  const firstGymshot = useMemo(() => {
    if (userPosts.length === 0) return null;
    const sortedByDate = [...userPosts].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    const firstDate = new Date(sortedByDate[0].createdAt);
    const day = String(firstDate.getDate()).padStart(2, '0');
    const month = String(firstDate.getMonth() + 1).padStart(2, '0');
    const year = firstDate.getFullYear();
    return `${day}.${month}.${year}`;
  }, [userPosts]);

  // Calculate workout statistics
  const workoutStats = useMemo(() => {
    const stats = {};
    userPosts.forEach(post => {
      if (post.tag) {
        stats[post.tag] = (stats[post.tag] || 0) + 1;
      }
    });
    return stats;
  }, [userPosts]);

  const handleSelectDay = (postId) => {
    navigation.navigate('Gymshots', { 
      userId: currentUser.id, 
      startFromPostId: postId 
    });
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#0b0f14' }}>
      <UnifiedHeader 
        title={`@${currentUser.handle}`}
        showBackButton={false}
      />
      
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        {/* Profile Banner */}
        <ProfileBanner bannerId={currentUser.equippedBanner} />
        
        <View style={{ paddingHorizontal: 16, paddingVertical: 16, alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#374151', marginTop: -40 }}>
          <View style={{ marginBottom: 12 }}>
            <ProfilePicture avatar={currentUser.avatar} size={80} streakCount={currentStreak} />
          </View>
          <Text style={{ color: 'white', fontSize: 24, fontWeight: '700' }}>{currentUser.name}</Text>
          <Text style={{ color: '#d1d5db', fontSize: 14, marginTop: 8, textAlign: 'center' }}>{currentUser.bio}</Text>
          
          {/* Stats Section */}
          <View style={{ width: '100%', marginTop: 16 }}>
            {/* Top Row: Gymshots, First Gymshot, Friends */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'flex-end', marginBottom: 12 }}>
              <View style={{ alignItems: 'center', flex: 1 }}>
                <Text style={{ color: 'white', fontSize: 16, fontWeight: '700' }}>{userPosts.length}</Text>
                <Text style={{ color: '#9ca3af', fontSize: 12 }}>Gymshots</Text>
              </View>
              <View style={{ alignItems: 'center', flex: 1 }}>
                <Text style={{ color: 'white', fontSize: 16, fontWeight: '700' }}>{firstGymshot || '—'}</Text>
                <Text style={{ color: '#9ca3af', fontSize: 12 }}>First Gymshot</Text>
              </View>
              <View style={{ alignItems: 'center', flex: 1 }}>
                <Text style={{ color: 'white', fontSize: 16, fontWeight: '700' }}>127</Text>
                <Text style={{ color: '#9ca3af', fontSize: 12 }}>Friends</Text>
              </View>
            </View>

            {/* Action Buttons */}
            <View style={{ flexDirection: 'row', gap: 8, marginBottom: 20, paddingHorizontal: 16 }}>
              <Pressable
                onPress={() => navigation.navigate('BannerGallery')}
                style={({ pressed }) => ({
                  flex: 1,
                  backgroundColor: pressed ? '#4b5563' : '#374151',
                  paddingVertical: 10,
                  borderRadius: 8,
                  alignItems: 'center',
                })}
              >
                <Text style={{ color: 'white', fontSize: 14, fontWeight: '600' }}>Banner Shop</Text>
              </Pressable>
              <Pressable
                onPress={() => navigation.navigate('EditProfile')}
                style={({ pressed }) => ({
                  flex: 1,
                  backgroundColor: pressed ? '#4b5563' : '#374151',
                  paddingVertical: 10,
                  borderRadius: 8,
                  alignItems: 'center',
                })}
              >
                <Text style={{ color: 'white', fontSize: 14, fontWeight: '600' }}>Edit Profile</Text>
              </Pressable>
            </View>
            
            {/* Main Streak Display */}
            <View style={{ alignItems: 'center', marginBottom: 12 }}>
              <Text style={{ color: '#9ca3af', fontSize: 14, marginBottom: 4 }}>Current Streak</Text>
              <Text style={{ color: streakInfo.currentColor, fontSize: 48, fontWeight: '700', textShadowColor: streakInfo.currentColor, textShadowOffset: { width: 0, height: 0 }, textShadowRadius: 10 }}>
                {currentStreak}
              </Text>
              <Text style={{ color: streakInfo.currentColor, fontSize: 16, fontWeight: '600', marginTop: 4 }}>
                {streakInfo.currentTierName}
              </Text>
            </View>
            
            {/* Progress Bar */}
            <View style={{ paddingHorizontal: 20 }}>
              <StreakProgressBar 
                currentColor={streakInfo.currentColor}
                nextColor={streakInfo.nextColor}
                progress={streakInfo.progress}
                nextTier={streakInfo.nextTier}
                isMaxTier={streakInfo.isMaxTier}
                tierName={streakInfo.currentTierName}
              />
            </View>
          </View>
        </View>

        <View style={{ padding: 16 }}>
          <CalendarMonth posts={userPosts} onSelectDay={handleSelectDay} />
        </View>

        {/* Workout Statistics */}
        <View style={{ paddingHorizontal: 16, paddingBottom: 100 }}>
          <Text style={{ color: 'white', fontSize: 18, fontWeight: '700', marginBottom: 12 }}>
            Workout Statistics
          </Text>
          <View style={{ backgroundColor: '#1f2937', borderRadius: 12, padding: 16 }}>
            {Object.keys(workoutStats).length === 0 ? (
              <Text style={{ color: '#9ca3af', fontSize: 14, textAlign: 'center' }}>
                No workouts recorded yet
              </Text>
            ) : (
              Object.entries(workoutStats).map(([tag, count]) => (
                <View key={tag} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 8 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={{ fontSize: 20, marginRight: 8 }}>{getWorkoutEmoji(tag)}</Text>
                    <Text style={{ color: 'white', fontSize: 16 }}>
                      {WORKOUT_TAGS[tag]?.label || tag}
                    </Text>
                  </View>
                  <Text style={{ color: '#9ca3af', fontSize: 16, fontWeight: '600' }}>
                    {count}
                  </Text>
                </View>
              ))
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
