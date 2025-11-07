import React, { memo } from 'react';
import { View, Image } from 'react-native';
import { getStreakColor } from '../utils/constants';

function ProfilePicture({ avatar, size = 40, streakCount = 0 }) {
  const streakColor = getStreakColor(streakCount);
  const borderWidth = size >= 60 ? 4 : 3; // Larger borders for bigger profile pics
  const radius = size / 2;
  const containerSize = size + (borderWidth * 2);
  
  return (
    <View
      style={{
        width: containerSize,
        height: containerSize,
        borderRadius: containerSize / 2,
        backgroundColor: streakColor,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: streakColor,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8,
        shadowRadius: size >= 60 ? 12 : 8,
        elevation: 10,
      }}
    >
      <Image
        source={avatar}
        style={{
          width: size,
          height: size,
          borderRadius: radius,
        }}
        resizeMode="cover"
        fadeDuration={0}
      />
    </View>
  );
}

export default memo(ProfilePicture);

