import { ReactNode } from "react";
import { Switch, Divider, InputNumber } from "@arco-design/web-react";
import useLocale from "@/hooks/useLocale";
import { useSettings } from "..";

export interface BlockProps {
  title?: ReactNode;
  options?: { name: string; value: string; type?: "switch" | "number" }[];
  withDivider?: boolean;
  children?: ReactNode;
}

export default function Block(props: BlockProps) {
  const { title, options, children, withDivider = true } = props;
  const { pageSetting, setPageSetting } = useSettings();
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
                  checked={!!pageSetting[option.value]}
                  onChange={(checked) => {
                    const newSetting = {
                      ...pageSetting,
                      [option.value]: checked,
                    };
                    setPageSetting(newSetting);
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
                  value={pageSetting.menuWidth}
                  max={500}
                  min={150}
                  onChange={(value) => {
                    const newSetting = {
                      ...pageSetting,
                      [option.value]: value,
                    };
                    setPageSetting(newSetting);
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
