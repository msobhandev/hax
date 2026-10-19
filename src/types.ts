export type ThemeMode = 'day' | 'night';

export interface LullabyTrack {
  id: string;
  title: string;
  duration: number; // in seconds
  description: string;
  mood: string;
  stars: number;
  artwork?: string;
  audioUrl?: string;
}

export interface LanternItem {
  id: 'star' | 'heart' | 'moon' | 'cloud';
  name: string;
  glowColor: string;
  description: string;
  isOn: boolean;
  intensity: number; // 0 to 100
}

export interface DreamDestination {
  id: string;
  name: string;
  coordinates: { x: number; y: number }; // percentage on map
  description: string;
  dreamType: string;
  delivered: boolean;
  lore: string;
}

export interface StoryScene {
  id: number;
  title: string;
  subtitle: string;
  text: string;
  image: string;
  fallbackColor: string;
}

export interface GuestbookEntry {
  id: string;
  name: string;
  message: string;
  stamp: string;
  date: string;
  isUserAdded?: boolean;
}
