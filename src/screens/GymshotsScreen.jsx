import React, { useMemo } from 'react';
import { FlatList, Image, Pressable, SafeAreaView, Text, View } from 'react-native';
import { usePosts } from '../state/PostsContext';
import { useRoute, useNavigation } from '@react-navigation/native';
import { getStreakColor, getWorkoutEmoji } from '../utils/constants';
import { computeDailyPostMap, computeCurrentStreak } from '../utils/streaks';
import UnifiedHeader from '../components/UnifiedHeader';

export default function GymshotsScreen() {
  const { posts, users } = usePosts();
  const navigation = useNavigation();
  const route = useRoute();
  const { userId, startFromPostId } = route.params;
  
  // Find the user
  const user = users[userId];
  
  // If no user found, go back
  if (!user) {
    navigation.goBack();
    return null;
  }

  // Get user's posts
  const userPosts = posts
    .filter(p => p.userId === user.id)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  // Use posts directly since streaks are now stored in the data
  const userPostsWithStreaks = userPosts;

  // Find starting index if specified
  const startIndex = startFromPostId ? userPostsWithStreaks.findIndex(p => p.id === startFromPostId) : 0;
  const validStartIndex = Math.max(0, startIndex);

  const renderPost = ({ item }) => (
    <View style={{ marginBottom: 12, backgroundColor: '#0b0f14' }}>
      <Pressable onPress={() => navigation.navigate('PostDetail', { postId: item.id })} style={{ paddingHorizontal: 12 }}>
        <View style={{ 
          width: '100%', 
          aspectRatio: 3 / 4, 
          backgroundColor: '#111827', 
          position: 'relative',
          borderRadius: 16,
          overflow: 'hidden'
        }}>
          <Image 
            source={typeof item.imageUri === 'string' ? { uri: item.imageUri } : item.imageUri} 
            style={{ width: '100%', height: '100%' }} 
          />
          
          {/* Certified tag day label */}
          <View style={{
            position: 'absolute',
            top: 12,
            right: 12,
            backgroundColor: getStreakColor(item.streak),
            paddingHorizontal: 8,
            paddingVertical: 4,
            borderRadius: 12,
          }}>
            <Text style={{ 
              color: 'white', 
              fontSize: 12, 
              fontWeight: '600',
              textTransform: 'uppercase'
            }}>
              {getWorkoutEmoji(item.tag)} {item.label} {item.tag} day
            </Text>
          </View>
          <View style={{ 
            position: 'absolute', 
            left: 12, 
            bottom: 12, 
            right: 12, 
            borderRadius: 12, 
            padding: 12, 
            backgroundColor: '#374151CC'
          }}>
            <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }} numberOfLines={2}>{item.caption}</Text>
            <Text style={{ color: '#d1d5db', fontSize: 14, marginTop: 4 }}>
              {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              {item.location ? ` · ${item.location}` : ''}
            </Text>
          </View>
        </View>
      </Pressable>
      <Pressable onPress={() => navigation.navigate('PostDetail', { postId: item.id })} style={{ paddingHorizontal: 12, paddingVertical: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {(item.impressions ?? []).slice(0, 5).map((emo, idx) => (
            <Text key={`${item.id}-emo-${idx}`} style={{ marginRight: 4 }}>{emo}</Text>
          ))}
          {(item.impressions ?? []).length > 5 && (
            <Text style={{ color: '#9ca3af', marginLeft: 4 }}>+{(item.impressions ?? []).length - 5}</Text>
          )}
        </View>
        {/* Streak indicator */}
        <View style={{
          backgroundColor: getStreakColor(item.streak),
          paddingHorizontal: 8,
          paddingVertical: 4,
          borderRadius: 12,
          minWidth: 32,
          alignItems: 'center',
          flexDirection: 'row',
        }}>
          <Text style={{ 
            color: 'white', 
            fontSize: 12, 
            fontWeight: '600',
          }}>
            🔥 {item.streak}
          </Text>
        </View>
      </Pressable>
      <Pressable onPress={() => navigation.navigate('PostDetail', { postId: item.id })} style={{ paddingHorizontal: 12, paddingBottom: 8 }}>
        <Text style={{ color: '#9ca3af', fontSize: 14 }}>Comments {item.comments?.length ?? 0}</Text>
        {(item.comments ?? []).slice(0, 2).map((comment, idx) => (
          <View key={`${item.id}-comment-${idx}`} style={{ marginTop: 4 }}>
            <Text style={{ color: 'white', fontSize: 14 }}>
              <Text style={{ fontWeight: '600' }}>{comment.userName}</Text>
              <Text> {comment.text}</Text>
            </Text>
          </View>
        ))}
      </Pressable>
    </View>
  );

  const getItemLayout = (data, index) => ({
    length: 400,
    offset: 400 * index,
    index,
  });

  const onScrollToIndexFailed = (info) => {
    console.log('ScrollToIndex failed:', info);
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#0b0f14' }}>
      <UnifiedHeader 
        title={`Gymshots by ${user.name}`}
        onBack={() => navigation.goBack()}
      />
      
      <FlatList
        data={userPostsWithStreaks}
        keyExtractor={(item) => item.id}
        renderItem={renderPost}
        contentContainerStyle={{ paddingVertical: 8, paddingBottom: 100 }} // Reduced bottom padding
        getItemLayout={getItemLayout}
        onScrollToIndexFailed={onScrollToIndexFailed}
        showsVerticalScrollIndicator={false}
        ref={(ref) => {
          if (ref && validStartIndex > 0) {
            setTimeout(() => {
              try {
                ref.scrollToIndex({ index: validStartIndex, animated: true });
              } catch (error) {
                console.log('Error scrolling to index:', error);
              }
            }, 100);
          }
        }}
      />
    </View>
  );
}
