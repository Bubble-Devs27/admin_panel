import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAuth = create(
  persist(
    (set) => ({
      token: null,
      details: null,
      setAuth: ({ token, details }) => set({ token, details }),
      clearAuth: () => set({ token: null, details: null }),
      baseURL : 'http://localhost:3000/api/v1'
    }),
    { name: "auth-store" } // localStorage key
  )
);
