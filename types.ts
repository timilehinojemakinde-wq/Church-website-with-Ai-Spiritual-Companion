
export interface NavItem {
  label: string;
  path: string;
}

export interface ServiceTime {
  day: string;
  time: string;
  name: string;
}

export interface DevotionalResponse {
  title: string;
  empathy: string;     // Direct, intimate acknowledgment of the user's state
  scripture: string;   // The anchor verse
  wisdom: string;      // A concise, profound, life-changing insight (The main statement)
  action: string;      // A single, simple, immediate physical or spiritual step
  prayer: string;      // A short, powerful declaration
}

export enum LoadingState {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
}

export interface SocialComment {
  id: string;
  username: string;
  text: string;
  timestamp: number;
}

export interface SocialPost {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  imageUrl: string;
  caption: string;
  likes: number;
  likedBy: string[]; // Array of user IDs
  comments: SocialComment[];
  timestamp: number;
}
