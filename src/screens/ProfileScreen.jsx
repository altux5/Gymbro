import React, { useMemo } from 'react';
import { Image, SafeAreaView, Text, View } from 'react-native';
import { usePosts } from '../state/PostsContext';
import CalendarMonth from '../components/CalendarMonth';
import { useRoute, useNavigation } from '@react-navigation/native';
import UnifiedHeader from '../components/UnifiedHeader';

export default function ProfileScreen() {
  const { posts, users } = usePosts();
  const route = useRoute();
  const navigation = useNavigation();

  // Get the user ID from route params
  const userId = route?.params?.userId;
  const user = users[userId];

  // If no user found, go back
  if (!user) {
    navigation.goBack();
    return null;
  }

  const userPosts = useMemo(() => 
    posts.filter(p => p.userId === user.id).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
    [posts, user.id]
  );

  // Get the highest streak value (final streak) from all posts
  const currentStreak = userPosts.length > 0 ? Math.max(...userPosts.map(p => p.streak)) : 0;

  const handleSelectDay = (postId) => {
    navigation.navigate('Gymshots', { 
      userId: user.id, 
      startFromPostId: postId 
    });
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#0b0f14' }}>
      <UnifiedHeader 
        title={user.name}
        onBack={() => navigation.goBack()}
      />
      
      {/* Profile Info */}
      <View style={{ paddingHorizontal: 16, paddingVertical: 16, alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#374151' }}>
        <Image source={user.avatar} style={{ width: 80, height: 80, borderRadius: 40, marginBottom: 12 }} />
        <Text style={{ color: 'white', fontSize: 24, fontWeight: '700' }}>{user.name}</Text>
        <Text style={{ color: '#9ca3af', fontSize: 16 }}>@{user.handle}</Text>
        <Text style={{ color: '#d1d5db', fontSize: 14, marginTop: 8, textAlign: 'center' }}>{user.bio}</Text>
        
        <View style={{ flexDirection: 'row', marginTop: 16, gap: 24 }}>
          <View style={{ alignItems: 'center' }}>
            <Text style={{ color: 'white', fontSize: 20, fontWeight: '700' }}>{userPosts.length}</Text>
            <Text style={{ color: '#9ca3af', fontSize: 14 }}>Gymshots</Text>
          </View>
          <View style={{ alignItems: 'center' }}>
            <Text style={{ color: 'white', fontSize: 20, fontWeight: '700' }}>127</Text>
            <Text style={{ color: '#9ca3af', fontSize: 14 }}>Friends</Text>
          </View>
          <View style={{ alignItems: 'center' }}>
            <Text style={{ color: 'white', fontSize: 20, fontWeight: '700' }}>
              {currentStreak}
            </Text>
            <Text style={{ color: '#9ca3af', fontSize: 14 }}>Streak</Text>
          </View>
        </View>
      </View>

      {/* Calendar */}
      <View style={{ flex: 1, padding: 16 }}>
        <CalendarMonth posts={userPosts} onSelectDay={handleSelectDay} />
      </View>
    </View>
  );
}