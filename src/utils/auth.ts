import { getLocal, LocalKeys, removeLocal, setLocal } from "./storage";

export function isLogin() {
  return !!getLocal(LocalKeys.TOKEN_KEY);
}

export function login(token: string) {
  setLocal(LocalKeys.TOKEN_KEY, token);
}

export function logout() {
  removeLocal(LocalKeys.TOKEN_KEY);
}
