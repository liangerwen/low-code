import { ReactNode } from "react";
import { Switch, Divider, InputNumber } from "@arco-design/web-react";
import { useSettings } from ".";
import { useLocale } from "../Locale";

export interface BlockProps {
  title?: ReactNode;
  options?: { name: string; value: string; type?: "switch" | "number" }[];
  withDivider?: boolean;
  children?: ReactNode;
}

export default function Block(props: BlockProps) {
  const { title, options, children, withDivider = true } = props;
  const [settings, setSettings] = useSettings();
  const { t } = useLocale();

  return (
    <div className="mb-[24px]">
      <h5 className="p-0 text-xl my-2">{title}</h5>
      {options &&
        options.map((option) => {
          const type = option.type || "switch";

          return (
            <div
              className="h-[32px] flex items-center justify-between"
              key={option.value}
            >
              <span>{t(option.name)}</span>
              {type === "switch" && (
                <Switch
                  size="small"
                  checked={!!settings[option.value]}
                  onChange={(checked) => {
                    const newSetting = {
                      ...settings,
                      [option.value]: checked,
                    };
                    setSettings(newSetting);
                    // set color week
                    if (checked && option.value === "colorWeek") {
                      document.body.style.filter = "invert(80%)";
                    }
                    if (!checked && option.value === "colorWeek") {
                      document.body.style.filter = "none";
                    }
                  }}
                />
              )}
              {type === "number" && (
                <InputNumber
                  style={{ width: 80 }}
                  size="small"
                  value={settings.menuWidth}
                  max={500}
                  min={150}
                  onChange={(value) => {
                    const newSetting = {
                      ...settings,
                      [option.value]: value,
                    };
                    setSettings(newSetting);
                  }}
                />
              )}
            </div>
          );
        })}
      {children}
      {withDivider && <Divider />}
    </div>
  );
}
