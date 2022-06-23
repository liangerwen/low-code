import { ButtonProps, Select } from "@arco-design/web-react";
import {
  IconDesktop,
  IconMoon,
  IconProps,
  IconSun,
} from "@arco-design/web-react/icon";
import React, { useMemo } from "react";
import IconButton from "../IconButton";
import { useLocale } from "../Locale";
import useMode, { ModeType } from "./useMode";

export default function ModeSetting(
  props: { iconOnly?: boolean } & ButtonProps & IconProps
) {
  const { iconOnly = false, ...rest } = props;
  const { mode, setMode } = useMode();
  const { t } = useLocale();

  const icon = useMemo(() => {
    switch (mode) {
      case ModeType.LGIHT:
        return <IconSun {...rest} />;
      case ModeType.DARK:
        return <IconMoon {...rest} />;
      case ModeType.AUTO:
        return <IconDesktop {...rest} />;
      default:
        return <IconSun {...rest} />;
    }
  }, [mode]);

  return (
    <Select
      triggerElement={iconOnly ? icon : <IconButton {...rest} icon={icon} />}
      options={[
        { label: t("navbar.mode.light"), value: ModeType.LGIHT },
        { label: t("navbar.mode.dark"), value: ModeType.DARK },
        { label: t("navbar.mode.system"), value: ModeType.AUTO },
      ]}
      value={mode}
      triggerProps={{
        autoAlignPopupWidth: false,
        autoAlignPopupMinWidth: true,
        position: "br",
      }}
      trigger="hover"
      onChange={(value: ModeType) => {
        setMode(value);
      }}
    />
  );
}
