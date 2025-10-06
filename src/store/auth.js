import { create } from "zustand";
import { persist } from "zustand/middleware";
const prod = "https://apps-backend-114i.onrender.com/api/v1"
export const useAuth = create(
  persist(
    (set) => ({
      token: null,
      details: null,
      setAuth: ({ token, details }) => set({ token, details }),
      clearAuth: () => set({ token: null, details: null }),
      baseURL : 'https://apps-backend-114i.onrender.com/api/v1'
    }),
    { name: "auth-store" } // localStorage key
  )
);
