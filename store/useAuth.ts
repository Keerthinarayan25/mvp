"use client";
import { create } from "zustand";


type User = {
  id:number;
  name:string;
  email:string;
  role: "developer" | "founder";

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