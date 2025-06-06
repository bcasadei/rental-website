'use client';
import { createContext, useContext, useState, ReactNode } from 'react';

type AuthModalContextType = {
  open: boolean;
  showSignIn: boolean;
  openModal: (signIn?: boolean) => void;
  closeModal: () => void;
  setShowSignIn: (v: boolean) => void;
};

const AuthModalContext = createContext<AuthModalContextType | undefined>(
  undefined
);

export function useAuthModal() {
  const ctx = useContext(AuthModalContext);
  if (!ctx)
    throw new Error('useAuthModal must be used within AuthModalProvider');
  return ctx;
}

export function AuthModalProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [showSignIn, setShowSignIn] = useState(false);

  const openModal = (signIn = false) => {
    setShowSignIn(signIn);
    setOpen(true);
  };
  const closeModal = () => setOpen(false);

  return (
    <AuthModalContext.Provider
      value={{ open, showSignIn, openModal, closeModal, setShowSignIn }}>
      {children}
    </AuthModalContext.Provider>
  );
}
