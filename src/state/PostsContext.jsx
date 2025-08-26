import React, { createContext, useContext, useMemo, useReducer } from 'react';
import { mockUsers, mockPosts } from '../utils/mockData';
import { TAG_KEYS } from '../utils/constants';

const initialState = {
  currentUser: mockUsers.me,
  users: mockUsers.all,
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
  }), [state]);

  return <PostsContext.Provider value={value}>{children}</PostsContext.Provider>;
}

export function usePosts() {
  const ctx = useContext(PostsContext);
  if (!ctx) throw new Error('usePosts must be used within PostsProvider');
  return ctx;
}



