import { useCallback } from "react";
import locales from "@/locale";
import { useSettings } from "@/components/Settings";

export default function useLocale() {
  const { lang } = useSettings();

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

  return { t };
}
