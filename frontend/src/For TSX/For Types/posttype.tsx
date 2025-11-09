// src/For TSX/For Types/posttype.tsx

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
  username: string;
  likes: number;
  comments: Comment[];
  visibility?: string;
  createdAt?: string;
  time?: string;
  likedByUser?: boolean;

  // ✅ add this to support backend field
  anonymous_name?: string;
}
