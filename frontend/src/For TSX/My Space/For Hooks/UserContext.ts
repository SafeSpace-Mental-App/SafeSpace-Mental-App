import { createContext } from "react";

export type User = {
  id: string;
  avatar: string | null;
};

export type UserContextType = {
  user: User;
  updateAvatar: (avatarUrl: string | null) => Promise<void>;
};

export const UserContext = createContext<UserContextType | undefined>(
  undefined
);
