import React from 'react';
import { View, Text, Pressable, Animated } from 'react-native';
import { BlurView } from 'expo-blur';

export default function UnifiedHeader({
  title,
  onBack,
  showBackButton = true,
  height = 60,
  style = {},
  titleOpacity = 1 // New prop for title opacity
}) {
  return (
    <View style={{
      height: height + 50, // Add extra height for status bar area
      zIndex: 1000,
      borderBottomLeftRadius: 20,
      borderBottomRightRadius: 20,
      overflow: 'hidden',
      backgroundColor: 'rgba(0, 0, 0, 0.3)', // Fallback background
      ...style,
    }}>
      {/* Frosted glass background */}
      <BlurView
        intensity={20}
        tint="dark"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
      />

      {/* Header content */}
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        height: height,
        marginTop: 50, // Push content down below status bar
        zIndex: 1001,
        justifyContent: 'center', // Center the content
      }}>
        {showBackButton && onBack && (
          <Pressable
            onPress={onBack}
            style={{
              position: 'absolute',
              left: 16,
              padding: 8, // Increase clickable area
            }}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} // Additional hit area
          >
            <Text style={{ color: 'white', fontSize: 28 }}>‹</Text>
          </Pressable>
        )}
        <Animated.Text style={{
          color: 'white',
          fontSize: 18,
          fontWeight: '600',
          textAlign: 'center', // Center the title
          opacity: titleOpacity // Apply title opacity
        }}>
          {title}
        </Animated.Text>
      </View>
    </View>
  );
}
