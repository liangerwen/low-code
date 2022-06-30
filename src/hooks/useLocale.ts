import { useCallback, useEffect, useRef } from "react";
import locales from "@/locale";
import { useSettings } from "@/components/Settings";

export default function useLocale() {
  const { lang } = useSettings();
  const notExistAry = useRef(new Set());

  const t = useCallback(
    (id: string, options?: { defaultValue?: string; params?: string[] }) => {
      let ret = locales[lang][id];
      const { defaultValue, params } = options || {};
      if (!ret) {
        notExistAry.current.add(id);
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

  useEffect(() => {
    notExistAry.current.forEach((id) => {
      console.warn(`Warning: locale id ${id} is not exist!`);
    });
  }, []);

  return { t };
}
