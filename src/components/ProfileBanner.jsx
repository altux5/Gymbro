import React, { memo } from 'react';
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { getBannerById } from '../utils/bannerData';

function ProfileBanner({ bannerId = 'default' }) {
  const banner = getBannerById(bannerId);
  
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={banner.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 150,
    width: '100%',
    overflow: 'hidden',
  },
  gradient: {
    flex: 1,
    width: '100%',
  },
});

export default memo(ProfileBanner);

