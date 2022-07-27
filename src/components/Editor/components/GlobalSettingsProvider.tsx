import { createContext, useContext, useState } from "react";

interface EditorGlobalSetting {
  pageSetting: {
    inMenu: boolean;
    data?: Record<string, any>;
    onLoad?: IEvent[];
    onDestroy?: IEvent[];
    onUpdate?: IEvent[];
  };
  apiSetting: {};
}

const GlobalSettingsContext = createContext<{
  globalSetting: EditorGlobalSetting;
  setGlobalSetting: (setting: EditorGlobalSetting) => void;
}>({
  globalSetting: {
    pageSetting: {
      inMenu: true,
    },
    apiSetting: {},
  },
  setGlobalSetting: () => {},
});

export const useGlobalSetting = () => useContext(GlobalSettingsContext);

export default function ({ children }) {
  const [globalSetting, setGlobalSetting] = useState<EditorGlobalSetting>({
    pageSetting: {
      inMenu: true,
    },
    apiSetting: {},
  });
  return (
    <GlobalSettingsContext.Provider value={{ globalSetting, setGlobalSetting }}>
      {children}
    </GlobalSettingsContext.Provider>
  );
}
