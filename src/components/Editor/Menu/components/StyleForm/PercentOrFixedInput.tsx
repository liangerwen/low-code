import { InputNumber, InputNumberProps, Tooltip } from "@arco-design/web-react";
import { IconSwap } from "@arco-design/web-react/icon";
import { isNull, isNumber, isUndefined } from "lodash";
import { useMemo, useState } from "react";

interface IProps {
  value?: number | string;
  onChange?: (val: number | string) => void;
}
export default function PercentOrFixedInput({
  value,
  onChange,
  ...rest
}: InputNumberProps & IProps) {
  const [isPercent, setIsPercent] = useState(false);
  const displayNumber = useMemo(() => {
    if (isNull(value) || isUndefined(value)) return value;
    if (!/^(\-|\+)?\d+(\.\d+)?%?$/.test(value.toString())) {
      onChange(undefined);
      return undefined;
    }
    if (isNumber(value)) {
      setIsPercent(false);
      return value;
    }
    setIsPercent(true);
    return value.split("%")[0];
  }, [value]);
  return (
    <InputNumber
      {...rest}
      value={displayNumber}
      onChange={(val) => {
        onChange(isPercent ? `${val}%` : val);
      }}
      min={isPercent ? 0 : rest.min}
      suffix={isPercent ? "%" : rest.suffix}
      prefix={
        <Tooltip content={isPercent ? "切换为固定值模式" : "切换为百分比模式"}>
          <IconSwap
            className="cursor-pointer"
            onClick={() => {
              setIsPercent(!isPercent);
              onChange(undefined);
            }}
          />
        </Tooltip>
      }
    />
  );
}
