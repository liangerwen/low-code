import classNames from "classnames";
import { ReactNode, useCallback } from "react";

export type ValueType = {
  top: number;
  left: number;
  right: number;
  bottom: number;
};

interface IProps {
  value?: ValueType;
  onChange?: (val: ValueType) => void;
  height?: number;
  children?: ReactNode;
  className?: string;
  tip?: string;
}

const borderXClassName =
  "absolute box-border h-0 w-[calc(100%-6px)] left-3px border-[rgb(var(--blue-2))] border-x-20px border-x-[transparent]";
const borderYClassName =
  "absolute box-border w-0 h-[calc(100%-6px)] top-3px border-[rgb(var(--blue-2))] border-y-20px border-y-[transparent]";
const inputXClassName =
  "absolute left-0 m-0 border-none text-center bg-inherit p-0 h-20px w-full color-[rgb(var(--gray-8))]";
const inputYClassName =
  "absolute top-0 m-0 border-none text-center bg-inherit p-0 h-full w-20px color-[rgb(var(--gray-8))]";

export default function BoxInput({
  value,
  onChange,
  height,
  children,
  className,
  tip,
}: IProps) {
  const handleChange = useCallback(
    (e, name) => {
      const val = e.target.value;
      if (val === "") {
        onChange({ ...value, [name]: undefined });
        return;
      }
      if (/^(\-|\+)?\d+(\.\d+)?%?$/.test(val)) {
        const number = Number(val);
        onChange?.({ ...value, [name]: isNaN(number) ? val : number });
      }
    },
    [value]
  );
  return (
    <div
      className={classNames("relative w-full", className)}
      style={{ height: height || "100%" }}
    >
      <div className={classNames(borderXClassName, "top-0 border-t-20px")}>
        <input
          value={value?.top || ""}
          className={classNames(inputXClassName, "-top-20px")}
          onChange={(e) => {
            handleChange(e, "top");
          }}
        />
      </div>
      <div className={classNames(borderYClassName, "left-0 border-l-20px")}>
        <input
          value={value?.left || ""}
          className={classNames(inputYClassName, "-left-20px")}
          onChange={(e) => {
            handleChange(e, "left");
          }}
        />
      </div>
      <div className={classNames(borderYClassName, "right-0 border-r-20px")}>
        <input
          value={value?.right || ""}
          className={classNames(inputYClassName, "-right-20px")}
          onChange={(e) => {
            handleChange(e, "right");
          }}
        />
      </div>
      <div className={classNames(borderXClassName, "bottom-0 border-b-20px")}>
        <input
          value={value?.bottom || ""}
          className={classNames(inputXClassName, "-bottom-20px")}
          onChange={(e) => {
            handleChange(e, "bottom");
          }}
        />
        {tip && (
          <span className="text-xs color-[rgb(var(--gray-6))]">{tip}</span>
        )}
      </div>
      {children && (
        <div
          className={
            "relative w-[calc(100%-40px)] top-20px left-20px right-20px bottom-20px"
          }
          style={{ height: `calc(${height ? height + "px" : "100%"} - 40px)` }}
        >
          {children}
        </div>
      )}
    </div>
  );
}
