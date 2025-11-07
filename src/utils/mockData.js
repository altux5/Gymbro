// Test with a simple image first
const testImage = require('../../assets/photos/ownprofile/profown-1.jpg');
console.log('Test image loaded:', testImage);

// Organize photos by user
const userPhotos = {
  me: [
    require('../../assets/photos/ownprofile/profown-1.jpg'),
    require('../../assets/photos/ownprofile/profown-2.jpg'),
    require('../../assets/photos/ownprofile/profown-3.jpg'),
  ],
  u1: [
    require('../../assets/photos/profile1/prof1-1.jpg'),
    require('../../assets/photos/profile1/prof1-2.jpg'),
    require('../../assets/photos/profile1/prof1-3.jpg'),
    require('../../assets/photos/profile1/prof1-4.jpg'),
    require('../../assets/photos/profile1/prof1-5.jpg'),
  ],
  u2: [
    require('../../assets/photos/profile2/prof2-1.jpg'),
    require('../../assets/photos/profile2/prof2-2.jpg'),
    require('../../assets/photos/profile2/prof2-3.jpg'),
    require('../../assets/photos/profile2/prof2-4.jpg'),
  ],
};

const avatars = [
  require('../../assets/photos/ownprofile/profown-pp.jpg'),
  require('../../assets/photos/profile1/prof1-pp.jpg'),
  require('../../assets/photos/profile2/prof2-pp.jpg'),
];

console.log('User photos loaded:', Object.keys(userPhotos).reduce((acc, key) => acc + userPhotos[key].length, 0));
console.log('Avatars loaded:', avatars.length);

const usersArray = [
  { id: 'u1', name: 'ibir', handle: 'haribo', avatar: avatars[1], bio: 'Gym enthusiast.' },
  { id: 'u2', name: 'ozdur', handle: 'bozduran', avatar: avatars[2], bio: 'Fitness lover.' },
];

const me = { id: 'me', name: 'chill2', handle: 'gymbro.me', avatar: avatars[0], bio: 'Chasing PRs.' };

const usersRecord = usersArray.reduce((acc, u) => { acc[u.id] = u; return acc; }, {});
usersRecord[me.id] = me;

export const mockUsers = {
  me,
  all: usersRecord,
};

function randomItem(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

import { TAG_KEYS, WORKOUT_TAGS } from './constants';

function randomTag() { return WORKOUT_TAGS[randomItem(TAG_KEYS)].key; }

const sampleLocations = [
  'Gold Gym, LA',
  'Anytime Fitness, NY',
  'Local Garage Gym',
  'Planet Fitness, TX',
  'Downtown Barbell Club',
  'Ozdilek Macfit',
  'Mac Akmerkez'
];

const sampleComments = [
  { userName: 'ibir', text: 'Looking strong! 💪' },
  { userName: 'ozdur', text: 'Great form!' },
  { userName: 'ozdur', text: 'Good job!' },
  { userName: 'ozdur', text: 'Hoollyy' },
  { userName: 'ibir', text: 'Keep it up!' },
  { userName: 'ibir', text: 'Damn!' },
  { userName: 'ozdur', text: 'Solid work!' },
  { userName: 'ozdur', text: 'Nice!' },
  { userName: 'chill2', text: 'Nice gains!' },
  { userName: 'chill2', text: 'Goodness!' },
];

// Create specific posts for each user with dedicated days
const createUserPosts = (userId, photos, totalPosts, startDayOffset = 0) => {
  const tags = ['pull', 'push', 'leg', 'fullBody', 'cardio', 'broSplit'];
  const labels = ['certified', 'clinic', 'critical', 'bombastic', 'deep', 'solid', 'hard', 'easy', 'chill'];
  const captions = [
    'Leg day grind 💪',
    'Back pumps! 🔥',
    'Chest and tris day',
    'Quick HIIT session',
    'Mobility + core work',
    'Deadlift PR! 🏋️',
    'Shoulder day gains',
    'Cardio and abs',
    'Squat day! 🦵',
    'Bench press focus',
    'Pull-up progress',
    'Rest day mobility'
  ];
  
  return Array.from({ length: totalPosts }).map((_, index) => {
    const photo = photos[index % photos.length]; // Cycle through available photos
    const daysAgo = startDayOffset + (index * 2); // Spread posts every 2 days
    const hoursAgo = daysAgo * 24 + (index * 3); // Add some hour variation
    
    return {
      id: `${userId}-p${index + 1}`,
      userId: userId,
      imageUri: photo,
      caption: captions[index % captions.length],
      createdAt: new Date(Date.now() - hoursAgo * 3600_000).toISOString(),
      likes: Math.floor(Math.random() * 500),
      tag: tags[index % tags.length],
      label: labels[Math.floor(Math.random() * labels.length)],
      location: sampleLocations[index % sampleLocations.length],
      // Don't assign streak here - we'll do it after sorting
      impressions: Array.from({ length: Math.floor(Math.random() * 9) }).map(() => randomItem(['💪', '🔥', '👏', '😤', '🫡', '🤩', '🤯', '🤔'])),
      comments: Array.from({ length: Math.floor(Math.random() * 4) }).map((_, commentIndex) => {
        const comment = randomItem(sampleComments);
        return {
          ...comment,
          createdAt: new Date(Date.now() - (hoursAgo + commentIndex) * 3600_000).toISOString(),
        };
      }),
    };
  });
};

// Create posts for each user without streak numbers
// Total posts should equal the user's streak level
const mePosts = createUserPosts('me', userPhotos.me, 34, 0);
const u1Posts = createUserPosts('u1', userPhotos.u1, 164, 1);
const u2Posts = createUserPosts('u2', userPhotos.u2, 6, 2);

// Combine all posts and sort by creation date (newest first)
const seedPosts = [...mePosts, ...u1Posts, ...u2Posts].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

// Now assign streak numbers based on the sorted order
// Group posts by user and assign streak numbers
const postsByUser = {};
seedPosts.forEach(post => {
  if (!postsByUser[post.userId]) {
    postsByUser[post.userId] = [];
  }
  postsByUser[post.userId].push(post);
});

// Assign streak numbers to each user's posts
Object.keys(postsByUser).forEach(userId => {
  const userPosts = postsByUser[userId];
  
  // Start all users from streak 1, so the highest streak equals total posts
  const initialStreak = 1;
  
  // Assign streak numbers (most recent posts get highest streak)
  // Since userPosts is already sorted newest first, we need to reverse the assignment
  userPosts.forEach((post, index) => {
    // Reverse the index so that the first post (most recent) gets the highest streak
    const reversedIndex = userPosts.length - 1 - index;
    post.streak = initialStreak + reversedIndex;
  });
});

export const mockPosts = seedPosts;



