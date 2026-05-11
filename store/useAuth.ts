"use client";
import { create } from "zustand";

export type UserRole =
  | "developer"
  | "founder";

type User = {
  id:number;
  name:string;
  email:string;
  roles: UserRole[];
  activeRole: UserRole;
  profileImage?: string | null;
  
} | null;

type AuthState = {
  user: User;
  loading: boolean;
  setUser: (user: User) => void;
  setLoading: (val: boolean) => void;

};


export const useAuth = create<AuthState>((set) => ({
  user:null,
  loading: true,
  setUser: (user) => set({user}),
  setLoading:(val) => set({ loading: val}),
}));