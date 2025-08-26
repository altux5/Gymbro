import React, { useState } from 'react';
import { Alert, Image, Pressable, SafeAreaView, Text, TextInput, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { usePosts } from '../state/PostsContext';
import { TAG_KEYS, WORKOUT_TAGS } from '../utils/constants';

export default function CaptureScreen() {
  const { addPost } = usePosts();
  const [imageUri, setImageUri] = useState(null);
  const [caption, setCaption] = useState('');
  const [location, setLocation] = useState('');
  const [tag, setTag] = useState('broSplit');

  async function pickImage() {
    const perm = await ImagePicker.requestCameraPermissionsAsync();
    if (perm.status !== 'granted') {
      Alert.alert('Camera permission required');
      return;
    }
    const res = await ImagePicker.launchCameraAsync({ quality: 0.8 });
    if (!res.canceled && res.assets?.length) setImageUri(res.assets[0].uri);
  }

  React.useEffect(() => {
    // open camera immediately
    pickImage();
  }, []);

  React.useEffect(() => {
    // fetch location after photo
    (async () => {
      if (!imageUri) return;
      try {
        const perm = await Location.requestForegroundPermissionsAsync();
        if (perm.status !== 'granted') return;
        const pos = await Location.getCurrentPositionAsync({});
        setLocation(`Lat ${pos.coords.latitude.toFixed(4)}, Lon ${pos.coords.longitude.toFixed(4)}`);
      } catch (e) {
        // ignore
      }
    })();
  }, [imageUri]);

  function onPost() {
    if (!imageUri) {
      Alert.alert('Select an image');
      return;
    }
    const labels = ['certified', 'clinic', 'critical', 'bombastic', 'deep', 'solid', 'hard', 'easy', 'chill'];
    const randomLabel = labels[Math.floor(Math.random() * labels.length)];
    addPost({ imageUri, caption, tag, location, impressions: [], label: randomLabel });
    setImageUri(null);
    setCaption('');
    setLocation('');
    setTag('broSplit');
    Alert.alert('Posted!');
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0b0f14', padding: 16 }}>
      <Pressable onPress={pickImage} style={{ height: 400, backgroundColor: '#111827', borderRadius: 12, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={{ width: '100%', height: '100%' }} />
        ) : (
          <Text style={{ color: '#9ca3af' }}>Tap to take photo (3:4)</Text>
        )}
      </Pressable>
      <TextInput
        placeholder="Caption"
        placeholderTextColor="#6b7280"
        value={caption}
        onChangeText={setCaption}
        style={{ color: 'white', marginTop: 12, borderWidth: 1, borderColor: '#1f2937', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10 }}
      />
      {!!location && (
        <View style={{ marginTop: 8 }}>
          <Text style={{ color: '#9ca3af', fontSize: 12 }}>{location}</Text>
        </View>
      )}
      <View style={{ flexDirection: 'row', marginTop: 12 }}>
        {TAG_KEYS.map((k) => {
          const active = tag === k;
          const color = WORKOUT_TAGS[k].color;
          return (
            <Pressable key={k} onPress={() => setTag(k)} style={{ paddingHorizontal: 12, paddingVertical: 8, borderRadius: 16, borderWidth: 2, borderColor: color, marginRight: 8, backgroundColor: active ? `${color}33` : 'transparent' }}>
              <Text style={{ color: 'white' }}>{WORKOUT_TAGS[k].label}</Text>
            </Pressable>
          );
        })}
      </View>
      <Pressable onPress={onPost} style={{ marginTop: 16, backgroundColor: '#22c55e', paddingVertical: 12, borderRadius: 10, alignItems: 'center' }}>
        <Text style={{ color: '#052e16', fontWeight: '800' }}>Post</Text>
      </Pressable>
    </SafeAreaView>
  );
}


