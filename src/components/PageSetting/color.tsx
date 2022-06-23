import { Trigger, Typography } from "@arco-design/web-react";
import { SketchPicker } from "react-color";
import { generate, getRgbStr } from "@arco-design/color";
import { useSettings } from ".";
import { setPrimaryColors } from "@/utils/theme";
import { useLocale } from "../Locale";

function ColorPanel() {
  const theme =
    document.querySelector("body").getAttribute("arco-theme") || "light";
  const [settings, setSettings] = useSettings();
  const { t } = useLocale();
  const themeColor = settings.themeColor;
  const list = generate(themeColor, { list: true });

  return (
    <div>
      {/* @ts-ignore */}
      <Trigger
        trigger="hover"
        position="bl"
        popup={() => (
          <SketchPicker
            color={themeColor}
            onChangeComplete={(color) => {
              const newColor = color.hex;
              setSettings({ ...settings, themeColor: newColor });
              const newList = generate(newColor, {
                list: true,
                dark: theme === "dark",
              });
              setPrimaryColors(newList.map((i) => getRgbStr(i)));
            }}
          />
        )}
      >
        <div className="flex w-full h-[32px] border p-[3px] box-border b-[var(--color-border)]">
          <div
            className="w-[100px] h-[24px] mr-[10px]"
            style={{ backgroundColor: themeColor }}
          />
          <span>{themeColor}</span>
        </div>
      </Trigger>
      <ul className="flex p-0 list-none">
        {list.map((item, index) => (
          <li
            key={index}
            className="w-[10%] h-[26px]"
            style={{ backgroundColor: item }}
          />
        ))}
      </ul>
      <Typography.Paragraph style={{ fontSize: 12 }}>
        {t("settings.color.tooltip")}
      </Typography.Paragraph>
    </div>
  );
}

export default ColorPanel;
