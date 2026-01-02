// src/For TSX/For Types/posttype.tsx
import type { User } from "../My Space/For Hooks/UserContext";

export interface Comment {
  id: string;
  username: string;
  text: string;
}


export interface Post {
  id: string;
  title: string;
  content: string;
  category: string;

  username: string; // for display & backward compatibility
  userId?: string; // link to author
  user?: User;
 

  likes: number;
  comments: Comment[];
  visibility?: string;
  createdAt: string;
  time?: number;
  likedByUser?: boolean;
  anonymous_name?: string;
}

export interface journalPost {
  id: string;
  title: string;
  content: string;
  time: number;
}
