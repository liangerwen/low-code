import { Message } from "@arco-design/web-react";
import { useCallback, useEffect } from "react";
import { clearPrimaryColors, getCustomOrRgb } from "@/utils/theme";
import { ThemeType, useSettings } from "@/components/Settings";
import useLocale from "@/hooks/useLocale";

const getThemeLinkElement = () =>
  document.getElementById("arco-custom-theme") as HTMLLinkElement;

const getThemeHref = (theme: ThemeType | null) =>
  theme
    ? `${theme.unpkgHost}${theme.packageName}@${theme.version}/css/arco.css`
    : "";

export default function useTheme() {
  const {
    pageSetting,
    setPageSetting,
    theme,
    setTheme: _setTheme,
  } = useSettings();

  const { t } = useLocale();

  const installTheme = useCallback((theme: ThemeType | null) => {
    return new Promise<boolean>((resolve) => {
      const oldLink = getThemeLinkElement();
      if (!theme) {
        oldLink && document.body.removeChild(oldLink);
        clearPrimaryColors();
        resolve(true);
        return;
      }
      const src = getThemeHref(theme);
      if (oldLink) {
        if (oldLink.href === src) {
          resolve(true);
          return;
        }
        oldLink.id = "arco-custom-theme--old";
      }
      const link = document.createElement("link");
      link.id = "arco-custom-theme";
      link.href = src;
      link.type = "text/css";
      link.rel = "stylesheet";
      link.onload = () => {
        oldLink && document.body.removeChild(oldLink);
        clearPrimaryColors();
        setPageSetting({
          ...pageSetting,
          themeColor: getCustomOrRgb(),
        });
        resolve(true);
      };
      link.onerror = () => {
        resolve(false);
      };
      document.body.append(link);
    });
  }, []);

  const setTheme = useCallback(
    (theme: ThemeType | null) =>
      installTheme(theme).then((res) => {
        if (res) {
          _setTheme(theme);
        }
        return res;
      }),
    [theme, _setTheme]
  );

  useEffect(() => {
    if (getThemeLinkElement()?.href !== getThemeHref(theme)) {
      installTheme(theme).then((res) => {
        if (theme) {
          if (res) {
            Message.success(
              t("settings.theme.current", { params: [theme.themeName] })
            );
          } else {
            Message.error(t("settings.theme.init.failed"));
          }
        }
      });
    }
  }, []);

  return { theme, setTheme };
}
