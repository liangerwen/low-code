import { getLocal, LocalKeys } from "@/utils/storage";
import { getCustomOrRgb } from "@/utils/theme";
import { createContext, useContext, useEffect, useState } from "react";
import { useLocalStorage } from "react-use";
import { getElementMode } from "./ModeSetting/useMode";

export enum LangType {
  CN = "zh-CN",
  US = "en-US",
}

export const enum ModeType {
  LGIHT = "light",
  DARK = "dark",
  AUTO = "auto",
}

export type ThemeType = {
  author: string;
  cover: string;
  packageName: string;
  themeId: number | string;
  themeName: string;
  unpkgHost: string;
  version: string;
  _id: string;
};

interface PageSetting {
  colorWeek: boolean;
  navbar: boolean;
  menu: boolean;
  footer: boolean;
  themeColor: string;
  menuWidth: number;
}

interface SettingsContext {
  pageSetting: PageSetting;
  setPageSetting: (pageSetting: PageSetting) => void;
  lang: LangType;
  setLang: (lang: LangType) => void;
  mode: ModeType;
  elementMode: ModeType.LGIHT | ModeType.DARK;
  setMode: (mode: ModeType) => void;
  theme: ThemeType | null;
  setTheme: (theme: ThemeType | null) => void;
}

const SettingContext = createContext<SettingsContext>({
  pageSetting: {
    colorWeek: false,
    navbar: true,
    menu: true,
    footer: true,
    themeColor: getCustomOrRgb(),
    menuWidth: 250,
  },
  setPageSetting: (pageSetting: PageSetting) => {},
  lang: getLocal(LocalKeys.LANG_KEY) || LangType.CN,
  setLang: (lang: LangType) => {},
  mode: getLocal(LocalKeys.MODE_KEY) || ModeType.LGIHT,
  elementMode:
    getLocal(LocalKeys.MODE_KEY) === ModeType.AUTO
      ? getElementMode()
      : getLocal(LocalKeys.MODE_KEY),
  setMode: (mode: ModeType) => {},
  theme: getLocal(LocalKeys.THEME_KEY),
  setTheme: (theme: ThemeType | null) => {},
});

export const useSettings = (): SettingsContext => {
  return useContext(SettingContext);
};

export const SettingProvider = ({ children }) => {
  const [pageSetting, setPageSetting] = useState({
    colorWeek: false,
    navbar: true,
    menu: true,
    footer: true,
    themeColor: getCustomOrRgb(),
    menuWidth: 250,
  });
  const [mode, setMode] = useLocalStorage<ModeType>(
    LocalKeys.MODE_KEY,
    ModeType.LGIHT
  );
  const [lang, setLang] = useLocalStorage<LangType>(
    LocalKeys.LANG_KEY,
    LangType.CN
  );
  const [theme, setTheme] = useLocalStorage<ThemeType>(
    LocalKeys.THEME_KEY,
    null
  );

  const [elementMode, setRealMode] = useState(
    mode === ModeType.AUTO ? getElementMode() : mode
  );

  useEffect(() => {
    const modeMutationObserver = new MutationObserver((list) => {
      if (list.length > 0) {
        const dom = list[0];
        const attrName = dom.attributeName;
        if (attrName === "arco-theme") {
          const val = document.body.getAttribute(attrName) as
            | ModeType.LGIHT
            | ModeType.DARK;
          setRealMode(val);
        }
      }
    });
    modeMutationObserver.observe(document.body, { attributes: true });
    return modeMutationObserver.disconnect;
  }, []);

  return (
    <SettingContext.Provider
      value={{
        pageSetting,
        setPageSetting,
        mode,
        elementMode,
        setMode,
        lang,
        setLang,
        theme,
        setTheme,
      }}
    >
      {children}
    </SettingContext.Provider>
  );
};
