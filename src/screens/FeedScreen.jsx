import React, { useState, useEffect, useRef, useMemo } from 'react';
import { FlatList, Image, Pressable, SafeAreaView, Text, View, StatusBar, TextInput, Modal, Animated, KeyboardAvoidingView, Platform } from 'react-native';
import { usePosts } from '../state/PostsContext';
import { useNavigation } from '@react-navigation/native';
import { getStreakColor, getWorkoutEmoji } from '../utils/constants';
import { computeDailyPostMap, computeCurrentStreak } from '../utils/streaks';
import { BlurView } from 'expo-blur';
import UnifiedHeader from '../components/UnifiedHeader';
import ProfilePicture from '../components/ProfilePicture';

function CommentsModal({ visible, onClose, post, user }) {
  const { addComment, users } = usePosts();
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState([]);
  const slideAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Update comments when post changes
  useEffect(() => {
    if (post) {
      setComments(post.comments || []);
    }
  }, [post]);

  // Handle modal animations
  useEffect(() => {
    if (visible) {
      // Show tint first
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
      
      // Then slide up container
      Animated.timing(slideAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      // Slide down first
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start(() => {
        // Then fade out tint
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }).start();
      });
    }
  }, [visible]);

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

  // Don't render if no post
  if (!post) {
    return null;
  }

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="none"
      onRequestClose={onClose}
    >
      <Animated.View style={{
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
        opacity: fadeAnim,
      }}>
        <Pressable 
          style={{ flex: 1 }} 
          onPress={onClose}
        />
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 0 }}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
        >
          <Animated.View style={{
            backgroundColor: '#0b0f14',
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            maxHeight: '85%',
            minHeight: '70%',
            transform: [{
              translateY: slideAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [400, 0],
              })
            }]
          }}>
            {/* Header */}
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: 16,
              borderBottomWidth: 1,
              borderBottomColor: '#1f2937',
            }}>
              <Text style={{ color: 'white', fontSize: 18, fontWeight: '600' }}>
                Comments ({comments.length})
              </Text>
              <Pressable onPress={onClose}>
                <Text style={{ color: '#9ca3af', fontSize: 16 }}>✕</Text>
              </Pressable>
            </View>

            {/* Comments List */}
            <FlatList
              data={comments}
              keyExtractor={(item, index) => `${post?.id || 'post'}-comment-${index}`}
              renderItem={({ item }) => {
                // Find the user for this comment
                const commentUser = Object.values(users).find(u => u.name === item.userName);
                
                return (
                  <View style={{
                    padding: 16,
                    borderBottomWidth: 1,
                    borderBottomColor: '#1f2937',
                  }}>
                    <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                      {commentUser?.avatar ? (
                        <View style={{ marginRight: 12 }}>
                          <ProfilePicture 
                            avatar={commentUser.avatar} 
                            size={32}
                            streakCount={commentUser.id === post.userId ? post.streak : 0}
                          />
                        </View>
                      ) : (
                        <View style={{
                          width: 32,
                          height: 32,
                          borderRadius: 16,
                          backgroundColor: getStreakColor(0),
                          marginRight: 12,
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                          <Text style={{ color: 'white', fontWeight: '600', fontSize: 12 }}>
                            {item.userName?.charAt(0)?.toUpperCase()}
                          </Text>
                        </View>
                      )}
                      <View style={{ flex: 1 }}>
                        <Text style={{ color: 'white', fontWeight: '600', fontSize: 14 }}>
                          {item.userName}
                        </Text>
                        <Text style={{ color: '#d1d5db', fontSize: 14, marginTop: 2 }}>
                          {item.text}
                        </Text>
                        <Text style={{ color: '#9ca3af', fontSize: 12, marginTop: 4 }}>
                          {formatTime(item.createdAt)}
                        </Text>
                      </View>
                    </View>
                  </View>
                );
              }}
              style={{ flex: 1 }}
            />

            {/* Add Comment Input */}
            <View style={{
              padding: 16,
              paddingBottom: Platform.OS === 'ios' ? 34 : 16, // Add extra padding for iOS home indicator
              borderTopWidth: 1,
              borderTopColor: '#1f2937',
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
                  borderRadius: 20,
                  paddingHorizontal: 16,
                  paddingVertical: 10,
                  marginRight: 8,
                }}
                multiline
              />
              <Pressable
                onPress={handleAddComment}
                disabled={!newComment.trim()}
                style={{
                  backgroundColor: newComment.trim() ? '#22c55e' : '#374151',
                  paddingHorizontal: 16,
                  paddingVertical: 10,
                  borderRadius: 20,
                }}
              >
                <Text style={{
                  color: newComment.trim() ? '#052e16' : '#6b7280',
                  fontWeight: '600',
                }}>
                  Post
                </Text>
              </Pressable>
            </View>
          </Animated.View>
        </KeyboardAvoidingView>
      </Animated.View>
    </Modal>
  );
}

function PostCard({ post, user, onPressUser, onPressComments, onPressPost }) {
  console.log('Post image source:', post.imageUri);
  console.log('User avatar source:', user.avatar);
  
  return (
    <View style={{ marginBottom: 12, backgroundColor: '#0b0f14' }}>
      <Pressable onPress={onPressUser} style={{ paddingHorizontal: 12, paddingTop: 12, paddingBottom: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={{ marginRight: 8 }}>
            <ProfilePicture avatar={user.avatar} size={32} streakCount={post.streak} />
          </View>
          <View>
            <Text style={{ color: 'white', fontWeight: '700' }}>{user.name}</Text>
            <Text style={{ color: '#9ca3af', fontSize: 12 }}>@{user.handle}</Text>
          </View>
        </View>
        {/* Streak indicator */}
        <View style={{
          backgroundColor: getStreakColor(post.streak),
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
            🔥 {post.streak}
          </Text>
        </View>
      </Pressable>
      <Pressable onPress={onPressPost} style={{ paddingHorizontal: 12 }}>
        <View style={{ 
          width: '100%', 
          aspectRatio: 3 / 4, 
          backgroundColor: '#111827', 
          position: 'relative',
          borderRadius: 16,
          overflow: 'hidden'
        }}>
          <Image 
            source={typeof post.imageUri === 'string' ? { uri: post.imageUri } : post.imageUri} 
            style={{ width: '100%', height: '100%' }} 
          />
          
          {/* Certified tag day label */}
          <View style={{
            position: 'absolute',
            top: 12,
            right: 12,
            backgroundColor: getStreakColor(post.streak),
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
              {getWorkoutEmoji(post.tag)} {post.label} {post.tag} day
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
            <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }} numberOfLines={2}>{post.caption}</Text>
            <Text style={{ color: '#d1d5db', fontSize: 14, marginTop: 4 }}>
              {new Date(post.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              {post.location ? ` · ${post.location}` : ''}
            </Text>
          </View>
        </View>
      </Pressable>
      <Pressable onPress={onPressPost} style={{ paddingHorizontal: 12, paddingVertical: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {(post.impressions ?? []).slice(0, 5).map((emo, idx) => (
            <Text key={`${post.id}-emo-${idx}`} style={{ marginRight: 4 }}>{emo}</Text>
          ))}
          {(post.impressions ?? []).length > 5 && (
            <Text style={{ color: '#9ca3af', marginLeft: 4 }}>+{(post.impressions ?? []).length - 5}</Text>
          )}
        </View>
      </Pressable>
      <Pressable onPress={onPressPost} style={{ paddingHorizontal: 12, paddingBottom: 8 }}>
        <Text style={{ color: '#9ca3af', fontSize: 14 }}>Comments {post.comments?.length ?? 0}</Text>
        {(post.comments ?? []).slice(0, 2).map((comment, idx) => (
          <View key={`${post.id}-comment-${idx}`} style={{ marginTop: 4 }}>
            <Text style={{ color: 'white', fontSize: 14 }}>
              <Text style={{ fontWeight: '600' }}>{comment.userName}</Text>
              <Text> {comment.text}</Text>
            </Text>
          </View>
        ))}
      </Pressable>
    </View>
  );
}

export default function FeedScreen() {
  const { posts, users } = usePosts();
  const navigation = useNavigation();
  const headerOpacityAnim = useRef(new Animated.Value(0)).current;
  const titleOpacityAnim = useRef(new Animated.Value(1)).current;
  const headerTitleOpacityAnim = useRef(new Animated.Value(0)).current; // New animation for header title
  const [selectedPost, setSelectedPost] = useState(null);
  const [commentsModalVisible, setCommentsModalVisible] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Use posts directly since streaks are now stored in the data
  const postsWithStreaks = posts;

  const handleScroll = (event) => {
    const scrollY = event.nativeEvent.contentOffset.y;
    const scrollDirection = scrollY > lastScrollY ? 'down' : 'up';
    setLastScrollY(scrollY);
    
    if (scrollDirection === 'down') {
      // Scrolling down: background appears and title fades
      const backgroundOpacity = Math.min(1, scrollY / 120); // Background appears at 120px
      const titleFade = Math.max(0, Math.min(1, (scrollY - 150) / 40)); // Title starts fading in at 150px, fully visible at 190px
      headerOpacityAnim.setValue(backgroundOpacity);
      titleOpacityAnim.setValue(titleFade);
      headerTitleOpacityAnim.setValue(titleFade); // Control header title opacity
    } else {
      // Scrolling up: title appears immediately, background adjusts
      const titleFade = Math.max(0, Math.min(1, (scrollY - 150) / 40)); // Title starts fading in at 150px, fully visible at 190px
      const backgroundOpacity = Math.min(1, scrollY / 120); // Background appears at 120px
      titleOpacityAnim.setValue(titleFade);
      headerOpacityAnim.setValue(backgroundOpacity);
      headerTitleOpacityAnim.setValue(titleFade); // Control header title opacity
    }
  };

  const handlePressComments = (post) => {
    setSelectedPost(post);
    setCommentsModalVisible(true);
  };

  const handleCloseComments = () => {
    setCommentsModalVisible(false);
    setSelectedPost(null);
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#0b0f14' }}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      {/* Dynamic header with frosted glass background */}
      <Animated.View style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        opacity: headerOpacityAnim,
      }}>
        <UnifiedHeader 
          title="gymbro"
          showBackButton={false}
          height={45} // Reduced from default 60 to 45
          titleOpacity={headerTitleOpacityAnim} // Pass the title opacity animation
          style={{ backgroundColor: 'transparent' }}
        />
      </Animated.View>

      <FlatList
        data={postsWithStreaks}
        keyExtractor={(p) => p.id}
        renderItem={({ item }) => (
          <PostCard
            post={item}
            user={users[item.userId]}
            onPressUser={() => {
              // If clicking on current user, navigate to My Profile tab
              if (item.userId === 'me') {
                navigation.navigate('My Profile');
              } else {
                navigation.navigate('Profile', { userId: item.userId, userName: users[item.userId]?.name });
              }
            }}
            onPressComments={handlePressComments}
            onPressPost={() => navigation.navigate('PostDetail', { postId: item.id })}
          />
        )}
        ListHeaderComponent={() => (
          <View style={{ 
            paddingTop: 80, // Space from top
            paddingBottom: 40, // Space before first post
            paddingHorizontal: 20,
          }}>
            <Text style={{ 
              color: 'white', 
              fontSize: 32,
              fontWeight: '700',
              textTransform: 'uppercase',
              letterSpacing: 2,
            }}>
              GYMBRO
            </Text>
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 24 }}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      />

      {/* Comments Modal */}
      <CommentsModal
        visible={commentsModalVisible}
        onClose={handleCloseComments}
        post={selectedPost}
        user={selectedPost ? users[selectedPost.userId] : null}
      />
    </View>
  );
}


