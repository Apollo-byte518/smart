export const AUTH_TOKEN_KEY = "ssc_token";

export function isAuthedClient(): boolean {
  if (typeof window === "undefined") return false;
  return Boolean(window.localStorage.getItem(AUTH_TOKEN_KEY));
}

export function loginClient(email: string) {
  if (typeof window === "undefined") return;
  const token = btoa(
    JSON.stringify({
      email,
      iat: Date.now(),
      v: 1,
    }),
  );
  window.localStorage.setItem(AUTH_TOKEN_KEY, token);
}

export function logoutClient() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(AUTH_TOKEN_KEY);
}

