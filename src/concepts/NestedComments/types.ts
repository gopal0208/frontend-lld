export interface Comment {
  id: string;
  author: string;
  text: string;
  timestamp: string;
  replies: Comment[];
}
