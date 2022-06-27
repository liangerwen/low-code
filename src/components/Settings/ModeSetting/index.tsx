import IconButton from "@/components/IconButton";
import useLocale from "@/hooks/useLocale";
import { ButtonProps, Select } from "@arco-design/web-react";
import {
  IconCheck,
  IconDesktop,
  IconMoon,
  IconProps,
  IconSun,
} from "@arco-design/web-react/icon";
import classNames from "classnames";
import { useMemo } from "react";
import { ModeType } from "..";
import useMode from "./useMode";

export default function ModeSetting(
  props: { iconOnly?: boolean } & ButtonProps & IconProps
) {
  const { iconOnly = false, ...rest } = props;
  const { mode, setMode } = useMode();
  const { t } = useLocale();

  const options = useMemo(
    () => [
      {
        label: t("settings.mode.light"),
        value: ModeType.LGIHT,
        icon: <IconSun {...rest} />,
      },
      {
        label: t("settings.mode.dark"),
        value: ModeType.DARK,
        icon: <IconMoon {...rest} />,
      },
      {
        label: t("settings.mode.system"),
        value: ModeType.AUTO,
        icon: <IconDesktop {...rest} />,
      },
    ],
    [t]
  );

  const icon = useMemo(
    () => options.find((o) => o.value === mode)?.icon || <IconSun {...rest} />,
    [mode, options]
  );

  return (
    <Select
      triggerElement={iconOnly ? icon : <IconButton {...rest} icon={icon} />}
      options={[
        { label: t("settings.mode.light"), value: ModeType.LGIHT },
        { label: t("settings.mode.dark"), value: ModeType.DARK },
        { label: t("settings.mode.system"), value: ModeType.AUTO },
      ]}
      value={mode}
      triggerProps={{
        autoAlignPopupWidth: false,
        autoAlignPopupMinWidth: true,
        position: "bottom",
      }}
      trigger="hover"
      onChange={(value: ModeType) => {
        setMode(value);
      }}
    >
      {options.map((o) => (
        <Select.Option
          key={o.value}
          value={o.value}
          className={classNames({
            "important-pl-9": o.value !== mode,
          })}
        >
          {o.value === mode && <IconCheck className="mr-2" />}
          {o.label}
        </Select.Option>
      ))}
    </Select>
  );
}
