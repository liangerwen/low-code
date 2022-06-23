import locales from "@/locale";
import { Button, ButtonProps, Message } from "@arco-design/web-react";
import { IconLanguage, IconProps } from "@arco-design/web-react/icon";
import React from "react";
import { createContext, useCallback, useContext } from "react";
import { useLocalStorage } from "react-use";
import IconButton from "../IconButton";

const LOCAL_KEY = "locale";

export enum LangType {
  CN = "zh-CN",
  US = "en-US",
}

const LocaleContext = createContext<{
  lang: LangType;
  setLang: (lang: LangType) => void;
}>({
  lang: LangType.CN,
  setLang: () => {},
});

export function useLocale() {
  const { lang, setLang } = useContext<{
    lang: LangType;
    setLang: (locale: LangType) => void;
  }>(LocaleContext);

  const t = useCallback(
    (id: string, options?: { defaultValue?: string; params?: string[] }) => {
      let ret = locales[lang][id];
      const { defaultValue, params } = options || {};
      if (!ret) {
        console.error(`locale error: id:${id} does not exist!`);
        return defaultValue || "";
      }
      if (params) {
        params.forEach((p, i) => {
          const index = i + 1;
          const reg = new RegExp(`{\\$${index}}`, "g");
          ret = ret.replace(reg, p);
        });
      }
      return ret;
    },
    [lang]
  );

  return { lang, setLang, t };
}

export const LocaleProvider = ({ children }: { children: React.ReactNode }) => {
  const [lang, setLang] = useLocalStorage(LOCAL_KEY, LangType.CN);
  return (
    <LocaleContext.Provider
      value={{
        lang,
        setLang,
      }}
    >
      {children}
    </LocaleContext.Provider>
  );
};

export default function LangSetting(
  props: { iconOnly?: boolean } & ButtonProps & IconProps
) {
  const { iconOnly = false, ...rest } = props;
  const { lang, setLang } = useLocale();

  const onClick = useCallback(() => {
    const nextLang = lang === LangType.CN ? LangType.US : LangType.CN;
    setLang(nextLang);
    Message.success(locales[nextLang]["navbar.lang.tips"]);
  }, [lang, setLang]);

  return (
    <>
      {iconOnly ? (
        <IconLanguage {...rest} onClick={onClick} />
      ) : (
        <Button
          {...rest}
          icon={<IconLanguage />}
          shape="circle"
          type="secondary"
          onClick={onClick}
        />
      )}
    </>
  );
}
