import { isColor } from "@/utils";
import { Trigger } from "@arco-design/web-react";
import { IconCloseCircle } from "@arco-design/web-react/icon";
import { useMemo } from "react";
import { SketchPicker } from "react-color";

interface IProps {
  value: string;
  onChange: (val: string) => void;
  allowClear?: boolean;
}

function ColorInput({ value, onChange, allowClear }: IProps) {
  const displayValue = useMemo(
    () => (isColor(value) ? value : "transparent"),
    [value]
  );
  return (
    <div className="flex items-center border b-[var(--color-border)] py-[3px] px-[6px]">
      <Trigger
        trigger="hover"
        position="bl"
        popup={() => (
          <SketchPicker
            color={displayValue}
            onChangeComplete={(color) => {
              const newColor = color.hex;
              onChange(newColor);
            }}
            presetColors={[
              "#D0021B",
              "#F5A623",
              "#F8E71C",
              "#8B572A",
              "#7ED321",
              "#417505",
              "#BD10E0",
              "#9013FE",
              "#4A90E2",
              "#50E3C2",
              "#B8E986",
              "#000000",
              "#4A4A4A",
              "#9B9B9B",
              "#FFFFFF",
              "transparent",
            ]}
          />
        )}
      >
        <div className="flex items-center">
          <div
            className="w-[100px] mr-8px h-24px"
            style={{ backgroundColor: displayValue }}
          />
          <span className="text-xs leading-[24px]">{value}</span>
        </div>
      </Trigger>
      {allowClear && (
        <IconCloseCircle
          className="ml-8px cursor-pointer text-20px important-color-[var(--color-fill-4)]"
          onClick={() => onChange(undefined)}
        />
      )}
    </div>
  );
}

export default ColorInput;
