// to authenticate user globally
"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

// Define user data type
interface User {
  username : string,
  email : string,
  password : string,
  kyberPub : string,
  kyberPriv : string,
  signPub : string,
  signPriv : string
}

// create the UserContext
export const UserContext = createContext<{ user: User | null; setUser: (user: User) => void } | null>(null);

// UserProvider component to wrap around layout.tsx
export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  // Debugging: Check when user changes
  useEffect(() => {
    console.log("UserContext Updated:", user);
  }, [user]);

  return <UserContext.Provider value={{ user, setUser }}>{children}</UserContext.Provider>;
}

// use custom hook to use the UserContext
export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
