import { create } from "zustand";

const tokenKey = "mm_token";
const userKey = "mm_user";

export const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem(userKey) || "null"),
  token: localStorage.getItem(tokenKey),
  loading: false,
  setCredentials: ({ user, token }) =>
    set(() => {
      localStorage.setItem(userKey, JSON.stringify(user));
      localStorage.setItem(tokenKey, token);
      return { user, token };
    }),
  logout: () =>
    set(() => {
      localStorage.removeItem(userKey);
      localStorage.removeItem(tokenKey);
      return { user: null, token: null };
    }),
}));

