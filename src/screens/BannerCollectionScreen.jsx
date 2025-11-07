import React from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, useRoute } from '@react-navigation/native';
import { usePosts } from '../state/PostsContext';
import UnifiedHeader from '../components/UnifiedHeader';
import { getBannerById } from '../utils/bannerData';

export default function BannerCollectionScreen() {
  const { users } = usePosts();
  const navigation = useNavigation();
  const route = useRoute();

  // Get user ID from route params, default to currentUser
  const userId = route?.params?.userId;
  const user = users[userId] || users.me;

  const ownedBanners = user.ownedBanners || ['default'];
  const equippedBannerId = user.equippedBanner || 'default';

  const renderBanner = (bannerId) => {
    const banner = getBannerById(bannerId);
    const isEquipped = equippedBannerId === bannerId;

    if (!banner) return null;

    return (
      <View key={bannerId} style={{ marginBottom: 16 }}>
        {/* Banner Preview */}
        <View style={{
          height: 120,
          borderRadius: 12,
          overflow: 'hidden',
          borderWidth: isEquipped ? 3 : 2,
          borderColor: isEquipped ? '#22c55e' : '#3b82f6',
        }}>
          <LinearGradient
            colors={banner.gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
          >
            {isEquipped && (
              <View style={{ position: 'absolute', top: 8, right: 8, backgroundColor: '#22c55e', borderRadius: 12, paddingHorizontal: 8, paddingVertical: 4 }}>
                <Text style={{ color: 'white', fontSize: 12, fontWeight: '600' }}>EQUIPPED</Text>
              </View>
            )}
          </LinearGradient>
        </View>

        {/* Banner Info */}
        <View style={{ marginTop: 8 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <Text style={{ color: 'white', fontSize: 16, fontWeight: '700' }}>{banner.name}</Text>
            <Text style={{
              color: banner.rarity === 'Mythic' ? '#FFD700' : banner.rarity === 'Legendary' ? '#FF6B9D' : banner.rarity === 'Epic' ? '#A855F7' : '#9ca3af',
              fontSize: 12,
              fontWeight: '600',
            }}>
              {banner.rarity}
            </Text>
          </View>
          <Text style={{ color: '#9ca3af', fontSize: 12, marginTop: 2 }}>{banner.description}</Text>
          <Text style={{ color: '#6b7280', fontSize: 11, marginTop: 4 }}>
            {banner.tier} Tier
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#0b0f14' }}>
      <UnifiedHeader
        title={`${user.name}'s Banners`}
        onBack={() => navigation.goBack()}
      />

      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        {/* Collection Info */}
        <View style={{ padding: 16, backgroundColor: '#1f2937', marginBottom: 16 }}>
          <Text style={{ color: 'white', fontSize: 18, fontWeight: '700', marginBottom: 4 }}>
            Banner Collection
          </Text>
          <Text style={{ color: '#9ca3af', fontSize: 14 }}>
            {ownedBanners.length} {ownedBanners.length === 1 ? 'banner' : 'banners'} collected
          </Text>
        </View>

        {/* Banners Grid */}
        <View style={{ paddingHorizontal: 16, paddingBottom: 100 }}>
          {ownedBanners.length === 0 ? (
            <View style={{ alignItems: 'center', marginTop: 40 }}>
              <Text style={{ fontSize: 48, marginBottom: 16 }}>🎨</Text>
              <Text style={{ color: '#9ca3af', fontSize: 16, textAlign: 'center' }}>
                No banners collected yet
              </Text>
            </View>
          ) : (
            ownedBanners.map(renderBanner)
          )}
        </View>
      </ScrollView>
    </View>
  );
}

