import { useContext } from "react";

import { UserContext } from "./UserContext";
import type { UserContextType } from "./UserContext";

export function useUser(): UserContextType {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error("useUser must be used within UserProvider");
  }

  return context;
}
