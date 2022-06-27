import { ModeType, useSettings } from "@/components/Settings";
import { useCallback, useEffect, useState } from "react";

export const getElementMode = () =>
  document.body.getAttribute("arco-theme") === ModeType.DARK
    ? ModeType.DARK
    : ModeType.LGIHT;

export const setElementMode = (mode: ModeType.LGIHT | ModeType.DARK) => {
  document.body.setAttribute("arco-theme", mode);
};

export default function useMode() {
  const { mode, setMode: _setMode } = useSettings();

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
    []
  );

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme:dark)");
    if (mode === ModeType.AUTO) {
      modeChangeListener(media);
      media.addEventListener("change", modeChangeListener);
    }
    return () => media.removeEventListener("change", modeChangeListener);
  }, [modeChangeListener, mode]);

  useEffect(() => {
    const currentMode = getElementMode();
    if (currentMode !== mode && mode !== ModeType.AUTO) {
      setElementMode(mode);
    }
  }, []);

  return { mode, setMode };
}
