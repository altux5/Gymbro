import React, { useState, useEffect, useMemo } from 'react';
import { 
  View, 
  Text, 
  Image, 
  FlatList, 
  TextInput, 
  Pressable, 
  SafeAreaView, 
  StatusBar, 
  KeyboardAvoidingView, 
  Platform 
} from 'react-native';
import { usePosts } from '../state/PostsContext';
import { useRoute, useNavigation } from '@react-navigation/native';
import { getStreakColor, getWorkoutEmoji } from '../utils/constants';
import { computeDailyPostMap, computeCurrentStreak } from '../utils/streaks';
import UnifiedHeader from '../components/UnifiedHeader';
import ProfilePicture from '../components/ProfilePicture';

export default function PostDetailScreen() {
  const { posts, users, addComment } = usePosts();
  const navigation = useNavigation();
  const route = useRoute();
  const { postId } = route.params;
  
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState([]);

  // Find the post
  const post = posts.find(p => p.id === postId);
  const user = post ? users[post.userId] : null;

  // Use post directly since streak is now stored in the data
  const postWithStreak = post;

  // Update comments when post changes
  useEffect(() => {
    if (post) {
      setComments(post.comments || []);
    }
  }, [post]);

  const handleAddComment = () => {
    if (newComment.trim() && post) {
      addComment({ postId: post.id, comment: newComment.trim() });
      setNewComment('');
      // Refresh comments list
      setTimeout(() => {
        setComments([...comments, {
          userName: 'chill2', // current user name
          text: newComment.trim(),
          createdAt: new Date().toISOString(),
        }]);
      }, 100);
    }
  };

  const formatTime = (timestamp) => {
    try {
      const date = new Date(timestamp);
      if (isNaN(date.getTime())) {
        return 'now';
      }
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (error) {
      return 'now';
    }
  };

  if (!postWithStreak || !user) {
    return (
      <View style={{ flex: 1, backgroundColor: '#0b0f14', justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: 'white' }}>Post not found</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#0b0f14' }}>
      <StatusBar barStyle="light-content" backgroundColor="#0b0f14" />

      <UnifiedHeader
        title="Post"
        onBack={() => navigation.goBack()}
      />
      
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <FlatList
          data={[{ type: 'post' }, ...comments]}
          keyExtractor={(item, index) => item.type === 'post' ? 'post' : `comment-${index}`}
          renderItem={({ item }) => {
            if (item.type === 'post') {
              return (
                <View style={{ padding: 16 }}>
                  {/* User Header */}
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <View style={{ marginRight: 12 }}>
                        <ProfilePicture avatar={user.avatar} size={40} streakCount={postWithStreak.streak} />
                      </View>
                      <View>
                        <Text style={{ color: 'white', fontWeight: '700', fontSize: 16 }}>{user.name}</Text>
                        <Text style={{ color: '#9ca3af', fontSize: 14 }}>@{user.handle}</Text>
                      </View>
                    </View>
                    {/* Streak indicator */}
                    <View style={{
                      backgroundColor: getStreakColor(postWithStreak.streak),
                      paddingHorizontal: 10,
                      paddingVertical: 6,
                      borderRadius: 16,
                      minWidth: 40,
                      alignItems: 'center',
                      flexDirection: 'row',
                    }}>
                      <Text style={{ 
                        color: 'white', 
                        fontSize: 14, 
                        fontWeight: '600',
                      }}>
                        🔥 {postWithStreak.streak}
                      </Text>
                    </View>
                  </View>

                  {/* Post Image */}
                  <View style={{ 
                    width: '100%', 
                    aspectRatio: 3 / 4, 
                    backgroundColor: '#111827', 
                    position: 'relative',
                    borderRadius: 16,
                    overflow: 'hidden',
                    marginBottom: 16
                  }}>
                    <Image 
                      source={typeof post.imageUri === 'string' ? { uri: post.imageUri } : post.imageUri} 
                      style={{ width: '100%', height: '100%' }} 
                    />
                    
                    {/* Certified tag day label */}
                    <View style={{
                      position: 'absolute',
                      top: 18,
                      right: 18,
                      backgroundColor: getStreakColor(post.streak),
                      paddingHorizontal: 12,
                      paddingVertical: 6,
                      borderRadius: 16,
                    }}>
                      <Text style={{ 
                        color: 'white', 
                        fontSize: 14, 
                        fontWeight: '600',
                        textTransform: 'uppercase'
                      }}>
                        {getWorkoutEmoji(postWithStreak.tag)} {postWithStreak.label} {postWithStreak.tag} day
                      </Text>
                    </View>
                    
                    <View style={{ 
                      position: 'absolute', 
                      left: 18, 
                      bottom: 18, 
                      right: 18, 
                      borderRadius: 16, 
                      padding: 16, 
                      backgroundColor: '#374151CC'
                    }}>
                      <Text style={{ color: 'white', fontSize: 18, fontWeight: '600' }} numberOfLines={3}>
                        {post.caption}
                      </Text>
                      <Text style={{ color: '#d1d5db', fontSize: 16, marginTop: 8 }}>
                        {new Date(post.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        {post.location ? ` · ${post.location}` : ''}
                      </Text>
                    </View>
                  </View>

                  {/* Impressions */}
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
                    {(post.impressions ?? []).slice(0, 8).map((emo, idx) => (
                      <Text key={`emo-${idx}`} style={{ marginRight: 6, fontSize: 18 }}>{emo}</Text>
                    ))}
                    {(post.impressions ?? []).length > 8 && (
                      <Text style={{ color: '#9ca3af', marginLeft: 4 }}>+{(post.impressions ?? []).length - 8}</Text>
                    )}
                  </View>

                  {/* Comments Header */}
                  <View style={{
                    borderTopWidth: 1,
                    borderTopColor: '#1f2937',
                    paddingTop: 16,
                    marginBottom: 8,
                  }}>
                    <Text style={{ color: 'white', fontSize: 18, fontWeight: '600' }}>
                      Comments ({comments.length})
                    </Text>
                  </View>
                </View>
              );
            } else {
              // Render comment
              const commentUser = Object.values(users).find(u => u.name === item.userName);
              
              return (
                <View style={{
                  paddingHorizontal: 16,
                  paddingVertical: 12,
                  borderBottomWidth: 1,
                  borderBottomColor: '#1f2937',
                }}>
                  <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                    {commentUser?.avatar ? (
                      <View style={{ marginRight: 12 }}>
                        <ProfilePicture 
                          avatar={commentUser.avatar} 
                          size={36}
                          streakCount={commentUser.id === post.userId ? post.streak : 0}
                        />
                      </View>
                    ) : (
                      <View style={{
                        width: 36,
                        height: 36,
                        borderRadius: 18,
                        backgroundColor: getStreakColor(0),
                        marginRight: 12,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                        <Text style={{ color: 'white', fontWeight: '600', fontSize: 14 }}>
                          {item.userName?.charAt(0)?.toUpperCase()}
                        </Text>
                      </View>
                    )}
                    <View style={{ flex: 1 }}>
                      <Text style={{ color: 'white', fontWeight: '600', fontSize: 16 }}>
                        {item.userName}
                      </Text>
                      <Text style={{ color: '#d1d5db', fontSize: 16, marginTop: 4 }}>
                        {item.text}
                      </Text>
                      <Text style={{ color: '#9ca3af', fontSize: 14, marginTop: 6 }}>
                        {formatTime(item.createdAt)}
                      </Text>
                    </View>
                  </View>
                </View>
              );
            }
          }}
          style={{ flex: 1 }}
        />

        {/* Add Comment Input */}
        <View style={{
          padding: 16,
          paddingBottom: Platform.OS === 'ios' ? 34 : 16,
          borderTopWidth: 1,
          borderTopColor: '#1f2937',
          backgroundColor: '#0b0f14',
          flexDirection: 'row',
          alignItems: 'center',
        }}>
          <TextInput
            placeholder="Add a comment..."
            placeholderTextColor="#6b7280"
            value={newComment}
            onChangeText={setNewComment}
            style={{
              flex: 1,
              color: 'white',
              borderWidth: 1,
              borderColor: '#1f2937',
              borderRadius: 24,
              paddingHorizontal: 16,
              paddingVertical: 12,
              marginRight: 8,
              fontSize: 16,
            }}
            multiline
          />
          <Pressable
            onPress={handleAddComment}
            disabled={!newComment.trim()}
            style={{
              backgroundColor: newComment.trim() ? '#22c55e' : '#374151',
              paddingHorizontal: 20,
              paddingVertical: 12,
              borderRadius: 24,
            }}
          >
            <Text style={{
              color: newComment.trim() ? '#052e16' : '#6b7280',
              fontWeight: '600',
              fontSize: 16,
            }}>
              Post
            </Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}
