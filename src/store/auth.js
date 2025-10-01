import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAuth = create(
  persist(
    (set) => ({
      token: null,
      details: null,
      setAuth: ({ token, details }) => set({ token, details }),
      clearAuth: () => set({ token: null, details: null }),
      baseURL : 'https://bubbles-backend-pz43.onrender.com'
    }),
    { name: "auth-store" } // localStorage key
  )
);
