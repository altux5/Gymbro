import React, { createContext, useContext, useMemo, useReducer } from 'react';
import { mockUsers, mockPosts } from '../utils/mockData';
import { TAG_KEYS, getStreakTierInfo } from '../utils/constants';
import { getBannerById, BANNER_CATALOG } from '../utils/bannerData';

// Helper function to get a random starting banner for a user based on their streak
function getRandomStartingBanner(userId) {
  // Calculate user's current streak from their posts
  const userPosts = mockPosts.filter(p => p.userId === userId);
  if (userPosts.length === 0) return 'default';
  
  const currentStreak = Math.max(...userPosts.map(p => p.streak));
  const tierInfo = getStreakTierInfo(currentStreak);
  
  // Get banners available for this tier (current tier and below)
  const availableBanners = BANNER_CATALOG.filter(b => b.tierThreshold <= tierInfo.currentTier);
  
  if (availableBanners.length === 0) return 'default';
  
  // For higher tier users, prefer banners from their current tier or one below
  const preferredBanners = availableBanners.filter(b => {
    // If at tier 15+, prefer banners from current tier
    if (currentStreak >= 15) {
      return b.tierThreshold === tierInfo.currentTier;
    }
    // Otherwise get any available banner
    return true;
  });
  
  const bannersToChooseFrom = preferredBanners.length > 0 ? preferredBanners : availableBanners;
  const randomBanner = bannersToChooseFrom[Math.floor(Math.random() * bannersToChooseFrom.length)];
  
  return randomBanner.id;
}

// Add banner fields to users with random starting banners
const usersWithBanners = Object.keys(mockUsers.all).reduce((acc, userId) => {
  const startingBanner = getRandomStartingBanner(userId);
  acc[userId] = {
    ...mockUsers.all[userId],
    equippedBanner: startingBanner,
    ownedBanners: ['default', startingBanner],
  };
  return acc;
}, {});

const meStartingBanner = getRandomStartingBanner('me');
const initialState = {
  currentUser: { ...mockUsers.me, equippedBanner: meStartingBanner, ownedBanners: ['default', meStartingBanner] },
  users: usersWithBanners,
  posts: mockPosts,
};

function reducer(state, action) {
  switch (action.type) {
    case 'ADD_POST': {
      // Calculate the new streak based on existing posts for this user
      const userPosts = state.posts.filter(p => p.userId === (action.payload.userId ?? state.currentUser.id));
      // Find the highest streak value from existing posts
      const highestStreak = userPosts.length > 0 ? Math.max(...userPosts.map(p => p.streak)) : 0;
      const newStreak = highestStreak + 1;
      
      const newPost = {
        id: `${Date.now()}`,
        userId: action.payload.userId,
        imageUri: action.payload.imageUri,
        caption: action.payload.caption ?? '',
        createdAt: new Date().toISOString(),
        likes: Math.floor(Math.random() * 200),
        tag: TAG_KEYS.includes(action.payload.tag) ? action.payload.tag : 'broSplit',
        label: action.payload.label ?? 'certified',
        location: action.payload.location ?? '',
        streak: newStreak,
        impressions: Array.isArray(action.payload.impressions) ? action.payload.impressions : [],
        comments: Array.isArray(action.payload.comments) ? action.payload.comments : [],
      };
      return { ...state, posts: [newPost, ...state.posts] };
    }
    case 'ADD_COMMENT': {
      const { postId, comment } = action.payload;
      const newComment = {
        userName: state.currentUser.name,
        text: comment,
        createdAt: new Date().toISOString(),
      };
      
      return {
        ...state,
        posts: state.posts.map(post => 
          post.id === postId 
            ? { ...post, comments: [...(post.comments || []), newComment] }
            : post
        )
      };
    }
    case 'PURCHASE_BANNER': {
      const { userId, bannerId } = action.payload;
      const targetUserId = userId || state.currentUser.id;
      
      return {
        ...state,
        users: {
          ...state.users,
          [targetUserId]: {
            ...state.users[targetUserId],
            ownedBanners: [...(state.users[targetUserId].ownedBanners || []), bannerId],
          },
        },
        ...(targetUserId === state.currentUser.id && {
          currentUser: {
            ...state.currentUser,
            ownedBanners: [...(state.currentUser.ownedBanners || []), bannerId],
          },
        }),
      };
    }
    case 'EQUIP_BANNER': {
      const { userId, bannerId } = action.payload;
      const targetUserId = userId || state.currentUser.id;
      
      return {
        ...state,
        users: {
          ...state.users,
          [targetUserId]: {
            ...state.users[targetUserId],
            equippedBanner: bannerId,
          },
        },
        ...(targetUserId === state.currentUser.id && {
          currentUser: {
            ...state.currentUser,
            equippedBanner: bannerId,
          },
        }),
      };
    }
    case 'UPDATE_PROFILE': {
      const { name, bio, avatar } = action.payload;
      const updatedUser = {
        ...state.currentUser,
        ...(name !== undefined && { name }),
        ...(bio !== undefined && { bio }),
        ...(avatar !== undefined && { avatar }),
      };
      
      return {
        ...state,
        currentUser: updatedUser,
        users: {
          ...state.users,
          [state.currentUser.id]: updatedUser,
        },
      };
    }
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

const PostsContext = createContext(undefined);

export function PostsProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const value = useMemo(() => ({
    ...state,
    addPost: ({ imageUri, caption, tag, location, impressions, comments, userId, label }) =>
      dispatch({ type: 'ADD_POST', payload: { imageUri, caption, tag, location, impressions, comments, userId: userId ?? state.currentUser.id, label } }),
    addComment: ({ postId, comment }) =>
      dispatch({ type: 'ADD_COMMENT', payload: { postId, comment } }),
    purchaseBanner: ({ userId, bannerId }) =>
      dispatch({ type: 'PURCHASE_BANNER', payload: { userId: userId ?? state.currentUser.id, bannerId } }),
    equipBanner: ({ userId, bannerId }) =>
      dispatch({ type: 'EQUIP_BANNER', payload: { userId: userId ?? state.currentUser.id, bannerId } }),
    updateProfile: ({ name, bio, avatar }) =>
      dispatch({ type: 'UPDATE_PROFILE', payload: { name, bio, avatar } }),
  }), [state]);

  return <PostsContext.Provider value={value}>{children}</PostsContext.Provider>;
}

export function usePosts() {
  const ctx = useContext(PostsContext);
  if (!ctx) throw new Error('usePosts must be used within PostsProvider');
  return ctx;
}



