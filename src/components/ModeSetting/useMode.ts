import { useCallback, useEffect } from "react";
import { useLocalStorage } from "react-use";

export const THEME_KEY = "mode";

export const enum ModeType {
  LGIHT = "light",
  DARK = "dark",
  AUTO = "auto",
}

export default function useMode() {
  const [mode, _setMode] = useLocalStorage<ModeType>(THEME_KEY, ModeType.LGIHT);

  const setElementMode = useCallback(
    (mode: ModeType.LGIHT | ModeType.DARK) => {
      document.body.setAttribute("arco-theme", mode);
    },
    [mode, _setMode]
  );

  const setMode = useCallback(
    (mode: ModeType) => {
      _setMode(mode);
      if (mode !== ModeType.AUTO) {
        setElementMode(mode);
      }
    },
    [mode, _setMode]
  );

  //监听样式切换
  const modeChangeListener = useCallback(
    (e?: MediaQueryList | MediaQueryListEvent) => {
      const prefersDarkMode = (
        e || window.matchMedia("(prefers-color-scheme:dark)")
      ).matches;
      if (prefersDarkMode) {
        setElementMode(ModeType.DARK);
      } else {
        setElementMode(ModeType.LGIHT);
      }
    },
    [mode, _setMode]
  );

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme:dark)");
    if (mode === ModeType.AUTO) {
      modeChangeListener(media);
      media.addEventListener("change", modeChangeListener);
    }
    return () => media.removeEventListener("change", modeChangeListener);
  }, [modeChangeListener]);

  useEffect(() => {
    const currentMode = document.body.getAttribute("arco-theme");
    if (currentMode !== mode && mode !== ModeType.AUTO) {
      document.body.setAttribute("arco-theme", mode);
    }
  }, []);

  return { mode, setMode };
}
