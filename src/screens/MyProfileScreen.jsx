import React, { useMemo } from 'react';
import { Image, SafeAreaView, Text, View } from 'react-native';
import { usePosts } from '../state/PostsContext';
import CalendarMonth from '../components/CalendarMonth';
import { useNavigation } from '@react-navigation/native';
import UnifiedHeader from '../components/UnifiedHeader';

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

  const handleSelectDay = (postId) => {
    navigation.navigate('Gymshots', { 
      userId: currentUser.id, 
      startFromPostId: postId 
    });
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#0b0f14' }}>
      <UnifiedHeader 
        title={currentUser.name}
        showBackButton={false}
      />
      
      <View style={{ paddingHorizontal: 16, paddingVertical: 16, alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#374151' }}>
        <Image source={currentUser.avatar} style={{ width: 80, height: 80, borderRadius: 40, marginBottom: 12 }} />
        <Text style={{ color: 'white', fontSize: 24, fontWeight: '700' }}>{currentUser.name}</Text>
        <Text style={{ color: '#9ca3af', fontSize: 16 }}>@{currentUser.handle}</Text>
        <Text style={{ color: '#d1d5db', fontSize: 14, marginTop: 8, textAlign: 'center' }}>{currentUser.bio}</Text>
        
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

      <View style={{ flex: 1, padding: 16 }}>
        <CalendarMonth posts={userPosts} onSelectDay={handleSelectDay} />
      </View>
    </View>
  );
}
