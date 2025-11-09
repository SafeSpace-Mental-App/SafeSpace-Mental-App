// src/For TSX/For Types/posttype.tsx

// ✅ Unified comment type
export interface Comment {
  id: string; // always string to avoid conflicts
  username: string;
  text: string;
}

// ✅ Unified post type
export interface Post {
  id: string; // always string
  title: string;
  content: string;
  category: string;
  username: string;
  likes: number;
  comments: Comment[];
  visibility?: string; // optional because old data might not have it
  createdAt?: string; // ✅ added to fix "createdAt does not exist" errors
  time?: string;

  // ✅ added this optional property to fix "likedByUser does not exist"
  likedByUser?: boolean;
}
