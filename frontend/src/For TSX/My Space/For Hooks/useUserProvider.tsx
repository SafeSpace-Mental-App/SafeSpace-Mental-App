import { useState } from "react";
import { UserContext } from "./UserContext";
import type {  User } from "./UserContext";
// import type { Post } from "../../For Types/posttype";
import axiosInstance from "../../../api/axiosInstance";

type UserProviderProps = {
  children: React.ReactNode;
};

const LOCAL_USER_KEY = "currentUser";

export function UserProvider({ children }: UserProviderProps) {
  const [user, setUser] = useState<User>(() => {
    const stored = localStorage.getItem(LOCAL_USER_KEY);
    return stored ? JSON.parse(stored) : { id: "user-1", avatar: null };
  });

  const updateAvatar = async (avatarUrl: string | null) => {
    // 1️⃣ Optimistic update (instant UI)
    setUser((prev) => {
      const updated = { ...prev, avatar: avatarUrl };
      localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(updated));
      return updated;
    });

    // 2️⃣ Send to backend (when online)
    try {
      await axiosInstance.patch("/api/users/avatar", {
        avatar: avatarUrl,
      });
    } catch (err) {
      console.warn("Avatar sync failed (offline)", err);
    }
  };

  return (
    <UserContext.Provider value={{ user, updateAvatar }}>
      {children}
    </UserContext.Provider>
  );
}
