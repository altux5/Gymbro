import React, { useMemo } from 'react';
import { View, Text, ScrollView, Pressable, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { usePosts } from '../state/PostsContext';
import UnifiedHeader from '../components/UnifiedHeader';
import { BANNER_CATALOG, getBannerById } from '../utils/bannerData';
import { getWorkoutEmoji } from '../utils/constants';

export default function BannerGalleryScreen() {
  const { posts, users, currentUser, purchaseBanner, equipBanner } = usePosts();
  const navigation = useNavigation();

  // Get user's current streak
  const userPosts = useMemo(
    () => posts.filter(p => p.userId === currentUser.id),
    [posts, currentUser.id]
  );
  const currentStreak = userPosts.length > 0 ? Math.max(...userPosts.map(p => p.streak)) : 0;

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

  // Get available and owned banners
  const availableBanners = BANNER_CATALOG.filter(b => currentStreak >= b.tierThreshold);
  const ownedBanners = currentUser.ownedBanners || ['default'];
  const equippedBannerId = currentUser.equippedBanner || 'default';

  const canAfford = (banner) => {
    return Object.entries(banner.cost).every(
      ([workout, required]) => (workoutStats[workout] || 0) >= required
    );
  };

  const handlePurchase = (banner) => {
    if (ownedBanners.includes(banner.id)) {
      Alert.alert('Already Owned', 'You already own this banner!');
      return;
    }

    if (!canAfford(banner)) {
      const missing = Object.entries(banner.cost)
        .filter(([workout, required]) => (workoutStats[workout] || 0) < required)
        .map(([workout, required]) => {
          const have = workoutStats[workout] || 0;
          return `${getWorkoutEmoji(workout)} ${required - have} more ${workout}`;
        })
        .join(', ');
      
      Alert.alert('Cannot Purchase', `You need: ${missing}`);
      return;
    }

    purchaseBanner({ bannerId: banner.id });
    Alert.alert('Success!', `${banner.name} purchased! Tap to equip it.`);
  };

  const handleEquip = (bannerId) => {
    if (!ownedBanners.includes(bannerId)) {
      Alert.alert('Not Owned', 'Purchase this banner first!');
      return;
    }

    equipBanner({ bannerId });
    Alert.alert('Equipped!', 'Banner equipped successfully!');
  };

  const renderBanner = (banner) => {
    const isOwned = ownedBanners.includes(banner.id);
    const isEquipped = equippedBannerId === banner.id;
    const isLocked = currentStreak < banner.tierThreshold;
    const affordable = canAfford(banner);

    return (
      <View key={banner.id} style={{ marginBottom: 16 }}>
        <Pressable
          onPress={() => {
            if (isLocked) {
              Alert.alert('Locked', `Reach ${banner.tier} tier (Streak ${banner.tierThreshold}) to unlock!`);
            } else if (isOwned) {
              handleEquip(banner.id);
            } else {
              handlePurchase(banner);
            }
          }}
          style={({ pressed }) => ({
            opacity: pressed ? 0.7 : 1,
          })}
        >
          {/* Banner Preview */}
          <View style={{
            height: 120,
            borderRadius: 12,
            overflow: 'hidden',
            borderWidth: isEquipped ? 3 : 2,
            borderColor: isEquipped ? '#22c55e' : isOwned ? '#3b82f6' : isLocked ? '#6b7280' : '#9ca3af',
          }}>
            <LinearGradient
              colors={isLocked ? ['#374151', '#4B5563'] : banner.gradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
            >
              {isLocked && (
                <Text style={{ fontSize: 32 }}>🔒</Text>
              )}
              {isEquipped && (
                <View style={{ position: 'absolute', top: 8, right: 8, backgroundColor: '#22c55e', borderRadius: 12, paddingHorizontal: 8, paddingVertical: 4 }}>
                  <Text style={{ color: 'white', fontSize: 12, fontWeight: '600' }}>EQUIPPED</Text>
                </View>
              )}
              {isOwned && !isEquipped && (
                <View style={{ position: 'absolute', top: 8, right: 8, backgroundColor: '#3b82f6', borderRadius: 12, paddingHorizontal: 8, paddingVertical: 4 }}>
                  <Text style={{ color: 'white', fontSize: 12, fontWeight: '600' }}>OWNED</Text>
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
            
            {/* Cost */}
            {!isOwned && !isLocked && (
              <View style={{ marginTop: 6 }}>
                <Text style={{ color: '#9ca3af', fontSize: 11, marginBottom: 4 }}>Cost:</Text>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
                  {Object.entries(banner.cost).map(([workout, count]) => {
                    const have = workoutStats[workout] || 0;
                    const hasEnough = have >= count;
                    return (
                      <View
                        key={workout}
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          backgroundColor: hasEnough ? '#22543d' : '#7f1d1d',
                          paddingHorizontal: 8,
                          paddingVertical: 4,
                          borderRadius: 8,
                        }}
                      >
                        <Text style={{ fontSize: 12, marginRight: 4 }}>{getWorkoutEmoji(workout)}</Text>
                        <Text style={{ color: 'white', fontSize: 11, fontWeight: '600' }}>
                          {have}/{count}
                        </Text>
                      </View>
                    );
                  })}
                </View>
              </View>
            )}
          </View>
        </Pressable>
      </View>
    );
  };

  // Group banners by tier
  const tiers = ['Novice', 'Intermediate', 'Advanced', 'Expert', 'Master', 'Elite', 'Champion', 'Legend', 'Immortal'];
  const bannersByTier = tiers.reduce((acc, tier) => {
    acc[tier] = BANNER_CATALOG.filter(b => b.tier === tier);
    return acc;
  }, {});

  return (
    <View style={{ flex: 1, backgroundColor: '#0b0f14' }}>
      <UnifiedHeader
        title="Banner Gallery"
        onBack={() => navigation.goBack()}
      />

      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        {/* User Stats Summary */}
        <View style={{ padding: 16, backgroundColor: '#1f2937', marginBottom: 16 }}>
          <Text style={{ color: 'white', fontSize: 16, fontWeight: '700', marginBottom: 8 }}>
            Your Workout Currency
          </Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {Object.entries(workoutStats).map(([workout, count]) => (
              <View
                key={workout}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  backgroundColor: '#374151',
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  borderRadius: 12,
                }}
              >
                <Text style={{ fontSize: 16, marginRight: 6 }}>{getWorkoutEmoji(workout)}</Text>
                <Text style={{ color: 'white', fontSize: 14, fontWeight: '600' }}>{count}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Banners by Tier */}
        <View style={{ paddingHorizontal: 16, paddingBottom: 100 }}>
          {tiers.map(tier => {
            const tiersbanners = bannersByTier[tier];
            if (tiersbanners.length === 0) return null;

            const tierUnlocked = availableBanners.some(b => b.tier === tier);

            return (
              <View key={tier} style={{ marginBottom: 24 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                  <Text style={{ color: 'white', fontSize: 18, fontWeight: '700', flex: 1 }}>
                    {tier} Tier
                  </Text>
                  {!tierUnlocked && (
                    <Text style={{ color: '#9ca3af', fontSize: 12 }}>
                      🔒 Unlock at Streak {tiersbanners[0].tierThreshold}
                    </Text>
                  )}
                </View>
                {tiersbanners.map(renderBanner)}
              </View>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}

