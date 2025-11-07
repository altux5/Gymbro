import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, ScrollView, Alert, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { usePosts } from '../state/PostsContext';
import UnifiedHeader from '../components/UnifiedHeader';
import ProfilePicture from '../components/ProfilePicture';

export default function EditProfileScreen() {
  const navigation = useNavigation();
  const { currentUser, posts, updateProfile } = usePosts();
  
  const [name, setName] = useState(currentUser.name);
  const [bio, setBio] = useState(currentUser.bio);
  
  // Calculate current streak from posts
  const userPosts = posts.filter(p => p.userId === currentUser.id);
  const currentStreak = userPosts.length > 0 ? Math.max(...userPosts.map(p => p.streak)) : 0;

  const handleSave = () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Name cannot be empty');
      return;
    }

    updateProfile({
      name: name.trim(),
      bio: bio.trim(),
    });

    Alert.alert('Success', 'Profile updated successfully!', [
      { text: 'OK', onPress: () => navigation.goBack() }
    ]);
  };

  const handleChangePhoto = () => {
    Alert.alert(
      'Change Profile Photo',
      'Photo selection will be implemented in a future update.',
      [{ text: 'OK' }]
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#0b0f14' }}>
      <UnifiedHeader
        title="Edit Profile"
        onBack={() => navigation.goBack()}
      />

      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        <View style={{ padding: 16 }}>
          {/* Profile Photo Section */}
          <View style={{ alignItems: 'center', marginBottom: 32, marginTop: 16 }}>
            <ProfilePicture 
              avatar={currentUser.avatar} 
              size={100} 
              streakCount={currentStreak} 
            />
            <Pressable 
              onPress={handleChangePhoto}
              style={({ pressed }) => ({
                marginTop: 16,
                opacity: pressed ? 0.7 : 1,
              })}
            >
              <Text style={{ color: '#3b82f6', fontSize: 16, fontWeight: '600' }}>
                Change Profile Photo
              </Text>
            </Pressable>
          </View>

          {/* Name Input */}
          <View style={{ marginBottom: 24 }}>
            <Text style={{ color: '#9ca3af', fontSize: 14, fontWeight: '600', marginBottom: 8 }}>
              Name
            </Text>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Enter your name"
              placeholderTextColor="#6b7280"
              style={{
                backgroundColor: '#1f2937',
                color: 'white',
                fontSize: 16,
                padding: 12,
                borderRadius: 8,
                borderWidth: 1,
                borderColor: '#374151',
              }}
              maxLength={30}
            />
          </View>

          {/* Bio Input */}
          <View style={{ marginBottom: 24 }}>
            <Text style={{ color: '#9ca3af', fontSize: 14, fontWeight: '600', marginBottom: 8 }}>
              Bio
            </Text>
            <TextInput
              value={bio}
              onChangeText={setBio}
              placeholder="Tell us about yourself"
              placeholderTextColor="#6b7280"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              style={{
                backgroundColor: '#1f2937',
                color: 'white',
                fontSize: 16,
                padding: 12,
                borderRadius: 8,
                borderWidth: 1,
                borderColor: '#374151',
                minHeight: 100,
              }}
              maxLength={150}
            />
            <Text style={{ color: '#6b7280', fontSize: 12, marginTop: 4, textAlign: 'right' }}>
              {bio.length}/150
            </Text>
          </View>

          {/* Save Button */}
          <Pressable
            onPress={handleSave}
            style={({ pressed }) => ({
              backgroundColor: pressed ? '#2563eb' : '#3b82f6',
              paddingVertical: 14,
              borderRadius: 8,
              alignItems: 'center',
              marginTop: 16,
            })}
          >
            <Text style={{ color: 'white', fontSize: 16, fontWeight: '700' }}>
              Save Changes
            </Text>
          </Pressable>

          {/* Cancel Button */}
          <Pressable
            onPress={() => navigation.goBack()}
            style={({ pressed }) => ({
              backgroundColor: pressed ? '#4b5563' : '#374151',
              paddingVertical: 14,
              borderRadius: 8,
              alignItems: 'center',
              marginTop: 12,
            })}
          >
            <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>
              Cancel
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

