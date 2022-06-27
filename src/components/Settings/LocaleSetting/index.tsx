import IconButton from "@/components/IconButton";
import locales from "@/locale";
import { ButtonProps, Message } from "@arco-design/web-react";
import { IconLanguage, IconProps } from "@arco-design/web-react/icon";
import { useCallback } from "react";
import { LangType, useSettings } from "..";

export default function LangSetting(
  props: { iconOnly?: boolean } & ButtonProps & IconProps
) {
  const { iconOnly = false, ...rest } = props;
  const { lang, setLang } = useSettings();

  const onClick = useCallback(() => {
    const nextLang = lang === LangType.CN ? LangType.US : LangType.CN;
    setLang(nextLang);
    Message.success(locales[nextLang]["settings.lang.tips"]);
  }, [lang, setLang]);

  return (
    <>
      {iconOnly ? (
        <IconLanguage {...rest} onClick={onClick} />
      ) : (
        <IconButton {...rest} icon={<IconLanguage />} onClick={onClick} />
      )}
    </>
  );
}
