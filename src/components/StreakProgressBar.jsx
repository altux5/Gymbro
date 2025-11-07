import React from 'react';
import { View, Text } from 'react-native';

function getMotivationalQuote(tierName, progress, isMaxTier) {
  if (isMaxTier) {
    return "Peak performance achieved! Immortal forever! 🏆";
  }
  
  const tier = tierName.toLowerCase();
  
  // Low progress: 0-33%
  if (progress <= 33) {
    if (tier === 'beginner' || tier === 'novice') {
      return "Just getting started, let's go!";
    } else if (tier === 'intermediate' || tier === 'advanced' || tier === 'expert') {
      return "New goals ahead, stay focused!";
    } else if (tier === 'master' || tier === 'elite' || tier === 'champion') {
      return "A new chapter of even more strength!";
    } else { // Legend
      return "A new chapter of even more strength??";
    }
  }
  
  // Medium progress: 34-66%
  if (progress <= 66) {
    if (tier === 'beginner' || tier === 'novice') {
      return "Building momentum, keep it up!";
    } else if (tier === 'intermediate' || tier === 'advanced' || tier === 'expert') {
      return "Halfway to greatness, don't stop!";
    } else if (tier === 'master' || tier === 'elite' || tier === 'champion') {
      return "Beast mode activated, keep grinding!";
    } else { // Legend
      return "You're already elite, but why stop?";
    }
  }
  
  // High progress: 67-99%
  if (tier === 'beginner' || tier === 'novice') {
    return "Almost there, push harder!";
  } else if (tier === 'intermediate' || tier === 'advanced' || tier === 'expert') {
    return "So close to the next level!";
  } else if (tier === 'master' || tier === 'elite' || tier === 'champion') {
    return "Legendary status incoming, push through!";
  } else { // Legend
    return "Damn we know you're a beast, keep going?!";
  }
}

export default function StreakProgressBar({ currentColor, nextColor, progress, nextTier, isMaxTier, tierName }) {
  const quote = getMotivationalQuote(tierName, progress, isMaxTier);
  return (
    <View style={{ width: '100%', marginTop: 8 }}>
      {/* Progress Bar Container */}
      <View style={{
        height: 10,
        backgroundColor: '#1f2937',
        borderRadius: 5,
        overflow: 'hidden',
        position: 'relative',
      }}>
        {/* Filled Progress */}
        <View
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: `${progress}%`,
            backgroundColor: currentColor,
            borderRadius: 5,
          }}
        />
        
        {/* Gradient hint to next color */}
        {!isMaxTier && progress > 50 && (
          <View
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              bottom: 0,
              width: `${progress}%`,
              backgroundColor: nextColor,
              opacity: Math.min(0.3, (progress - 50) / 100),
              borderRadius: 5,
            }}
          />
        )}
      </View>
      
      {/* Motivational Quote */}
      <View style={{
        marginTop: 6,
        paddingHorizontal: 2,
        alignItems: 'center',
      }}>
        <Text style={{ color: '#9ca3af', fontSize: 12, textAlign: 'center' }}>
          {quote}
        </Text>
      </View>
    </View>
  );
}

