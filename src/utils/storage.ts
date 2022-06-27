export const enum LocalKeys {
  TOKEN_KEY = "token",
  MODE_KEY = "mode",
  THEME_KEY = "theme",
  LANG_KEY = "lang",
}

export const getLocal = <T>(key: LocalKeys): T | null => {
  const val = localStorage.getItem(key);
  try {
    return JSON.parse(val) as T;
  } catch {
    removeLocal(key);
    return null;
  }
};

export const setLocal = <T>(key: LocalKeys, val: T) => {
  localStorage.setItem(key, JSON.stringify(val));
};

export const removeLocal = (key: LocalKeys) => {
  localStorage.removeItem(key);
};
