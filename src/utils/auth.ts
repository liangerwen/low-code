export const TOKEN_KEY = "token";

export function isLogin() {
  return !!localStorage.getItem(TOKEN_KEY);
}

export function login(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function logout() {
  localStorage.removeItem(TOKEN_KEY);
}
