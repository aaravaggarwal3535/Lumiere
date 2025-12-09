export enum AppView {
  HOME = 'HOME',
  SESSION = 'SESSION',
  ABOUT = 'ABOUT',
  CONTACT = 'CONTACT',
}

export interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export interface CameraViewProps {
  onBack: () => void;
}

export interface FeedbackOverlayProps {
  isLoading: boolean;
  messages: Message[];
  isSpeaking: boolean;
}