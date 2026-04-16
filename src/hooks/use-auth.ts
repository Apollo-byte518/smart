"use client";

import * as React from "react";
import { isAuthedClient, loginClient, logoutClient } from "@/lib/auth";

export function useAuth() {
  const [isAuthed, setIsAuthed] = React.useState(false);

  React.useEffect(() => {
    setIsAuthed(isAuthedClient());

    const onStorage = () => setIsAuthed(isAuthedClient());
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const login = React.useCallback((email: string) => {
    loginClient(email);
    setIsAuthed(true);
  }, []);

  const logout = React.useCallback(() => {
    logoutClient();
    setIsAuthed(false);
  }, []);

  return { isAuthed, login, logout };
}

