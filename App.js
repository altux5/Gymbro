import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'react-native';
import FeedScreen from './src/screens/FeedScreen';
import CaptureScreen from './src/screens/CaptureScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import MyProfileScreen from './src/screens/MyProfileScreen';
import PostDetailScreen from './src/screens/PostDetailScreen';
import GymshotsScreen from './src/screens/GymshotsScreen';
import BannerGalleryScreen from './src/screens/BannerGalleryScreen';
import BannerCollectionScreen from './src/screens/BannerCollectionScreen';
import EditProfileScreen from './src/screens/EditProfileScreen';
import { PostsProvider } from './src/state/PostsContext';
import { Ionicons } from '@expo/vector-icons';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { View } from 'react-native';
import { BlurView } from 'expo-blur';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function TabNavigator() {
  const scheme = useColorScheme();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#22c55e',
        tabBarInactiveTintColor: '#9ca3af',
        tabBarStyle: { 
          backgroundColor: 'transparent',
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          borderTopWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 75,
          zIndex: 1000,
        },
        tabBarBackground: () => (
          <View style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            overflow: 'hidden',
          }}>
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
          </View>
        ),
        tabBarItemStyle: {
          backgroundColor: 'transparent',
        },
        tabBarShowLabel: false,
        tabBarIcon: ({ focused, color, size }) => {
          const iconName =
            route.name === 'Feed'
              ? focused
                ? 'barbell'
                : 'barbell-outline'
              : route.name === 'Capture'
              ? focused
                ? 'camera'
                : 'camera-outline'
              : focused
              ? 'person'
              : 'person-outline';
          
          if (route.name === 'Capture') {
            return (
              <View style={{
                backgroundColor: 'white',
                width: 56,
                height: 56,
                borderRadius: 28,
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: -20,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.25,
                shadowRadius: 4,
                elevation: 5,
                zIndex: 1001,
              }}>
                <Ionicons name={iconName} size={28} color="#000" />
              </View>
            );
          }
          
          // Make the barbell icon bigger
          if (route.name === 'Feed') {
            return <Ionicons name={iconName} size={size + 4} color={color} />;
          }
          
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Feed" component={FeedScreen} />
      <Tab.Screen name="Capture" component={CaptureScreen} />
      <Tab.Screen name="My Profile" component={MyProfileScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  const scheme = useColorScheme();
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PostsProvider>
        <NavigationContainer theme={scheme === 'dark' ? DarkTheme : DefaultTheme}>
          <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
          <Stack.Navigator 
            screenOptions={{
              headerShown: false,
            }}
          >
            <Stack.Screen 
              name="Main" 
              component={TabNavigator} 
            />
            <Stack.Screen 
              name="Profile" 
              component={ProfileScreen}
            />
            <Stack.Screen 
              name="PostDetail" 
              component={PostDetailScreen}
            />
            <Stack.Screen 
              name="Gymshots" 
              component={GymshotsScreen}
            />
            <Stack.Screen 
              name="BannerGallery" 
              component={BannerGalleryScreen}
            />
            <Stack.Screen 
              name="BannerCollection" 
              component={BannerCollectionScreen}
            />
            <Stack.Screen 
              name="EditProfile" 
              component={EditProfileScreen}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </PostsProvider>
    </GestureHandlerRootView>
  );
}



