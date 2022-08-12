import { produce } from "@/utils";
import { InputNumber, Select, Space } from "@arco-design/web-react";
import classNames from "classnames";
import { CSSProperties, useCallback, useMemo, useState } from "react";
import ColorInput from "./ColorInput";
import PercentOrFixedInput from "./PercentOrFixedInput";

interface IProps {
  value?: CSSProperties;
  onChange?: (val: CSSProperties) => void;
}

const arcoIconClassName = "arco-icon arco-icon-select-all text-14px";
const borderIconClassName = "text-24px cursor-pointer";
const activeClassName = "important-color-[rgb(var(--primary-6))]";

const delAllBorderRadius = (style) => {
  delete style.borderRadius;
};
const delEachBorderRadius = (style) => {
  delete style.borderTopLeftRadius;
  delete style.borderTopRightRadius;
  delete style.borderBottomLeftRadius;
  delete style.borderBottomRightRadius;
};
const delAllBorder = (style) => {
  delete style.borderStyle;
  delete style.borderColor;
  delete style.borderWidth;
};
const delEachBorder = (style) => {
  delete style.borderTopWidth;
  delete style.borderRightWidth;
  delete style.borderLeftWidth;
  delete style.borderBottomWidth;
  delete style.borderTopStyle;
  delete style.borderRightStyle;
  delete style.borderLeftStyle;
  delete style.borderBottomStyle;
  delete style.borderTopColor;
  delete style.borderRightColor;
  delete style.borderLeftColor;
  delete style.borderBottomColor;
};

const toUpperFirstCase = (str: string) => {
  if (str.length === 0) return "";
  return str[0].toUpperCase() + str.slice(1);
};

export default function BorderForm({ value = {}, onChange }: IProps) {
  const [radiusType, setRadiusType] = useState<
    "topLeft" | "topRight" | "bottomLeft" | "bottomRight" | "all"
  >("all");
  const [borderType, setBorderType] = useState<
    "top" | "right" | "left" | "bottom" | "all"
  >("all");

  const getBorderStyle = useCallback(
    (
      obj: any,
      type: "radius" | "style" | "width" | "color",
      direction: typeof radiusType | typeof borderType
    ) => {
      const dire = direction === "all" ? "" : toUpperFirstCase(direction);
      const key = "border" + dire + toUpperFirstCase(type);
      return obj[key];
    },
    []
  );

  const radiusDisplayValue = useMemo(
    () => getBorderStyle(value, "radius", radiusType),
    [radiusType, value]
  );
  const borderWidthDisplayValue = useMemo(
    () => getBorderStyle(value, "width", borderType),
    [borderType, value]
  );
  const borderStyleDisplayValue = useMemo(
    () => getBorderStyle(value, "style", borderType),
    [borderType, value]
  );
  const borderColorDisplayValue = useMemo(
    () => getBorderStyle(value, "color", borderType),
    [borderType, value]
  );

  const handleChange = useCallback(
    (
      type: "radius" | "style" | "width" | "color",
      direction: typeof radiusType | typeof borderType,
      val: any,
      init?: (val: CSSProperties, direction?: string) => void
    ) => {
      onChange(
        produce(value, (value) => {
          const dire = direction === "all" ? "" : toUpperFirstCase(direction);
          const key = "border" + dire + toUpperFirstCase(type);
          init?.(value, dire);
          value[key] = val;
        })
      );
    },
    [onChange, value]
  );

  return (
    <Space direction="vertical" size="large">
      <Space direction="vertical">
        <label>圆角</label>
        <Space size="large">
          <div className="w-90px">
            <div className="flex justify-between">
              <i
                className={classNames(
                  arcoIconClassName,
                  borderIconClassName,
                  {
                    [activeClassName]: radiusType === "topLeft",
                  },
                  "i-ant-design:radius-upleft-outlined"
                )}
                onClick={() => setRadiusType("topLeft")}
              />
              <i
                className={classNames(
                  arcoIconClassName,
                  borderIconClassName,
                  {
                    [activeClassName]: radiusType === "topRight",
                  },
                  "i-ant-design:radius-upright-outlined"
                )}
                onClick={() => setRadiusType("topRight")}
              />
            </div>
            <div className="flex justify-center">
              <i
                className={classNames(
                  arcoIconClassName,
                  borderIconClassName,
                  {
                    [activeClassName]: radiusType === "all",
                  },
                  "i-mdi:border-radius"
                )}
                onClick={() => setRadiusType("all")}
              />
            </div>
            <div className="flex justify-between">
              <i
                className={classNames(
                  arcoIconClassName,
                  borderIconClassName,
                  {
                    [activeClassName]: radiusType === "bottomLeft",
                  },
                  "i-ant-design:radius-bottomleft-outlined"
                )}
                onClick={() => setRadiusType("bottomLeft")}
              />
              <i
                className={classNames(
                  arcoIconClassName,
                  borderIconClassName,
                  {
                    [activeClassName]: radiusType === "bottomRight",
                  },
                  "i-ant-design:radius-bottomright-outlined"
                )}
                onClick={() => setRadiusType("bottomRight")}
              />
            </div>
          </div>
          <PercentOrFixedInput
            value={radiusDisplayValue}
            className="flex-1"
            min={0}
            suffix="px"
            step={1}
            precision={1}
            onChange={(val) => {
              handleChange("radius", radiusType, val, (value) => {
                if (val) {
                  if (radiusType === "all") {
                    delEachBorderRadius(value);
                  } else {
                    delAllBorderRadius(value);
                  }
                }
              });
            }}
          />
        </Space>
      </Space>
      <Space direction="vertical">
        <label>边框</label>
        <Space size="large">
          <div className="w-90px">
            <div className="flex justify-center">
              <i
                className={classNames(
                  arcoIconClassName,
                  borderIconClassName,
                  {
                    [activeClassName]: borderType === "top",
                  },
                  "i-ant-design:border-top-outlined"
                )}
                onClick={() => setBorderType("top")}
              />
            </div>
            <div className="flex justify-between">
              <i
                className={classNames(
                  arcoIconClassName,
                  borderIconClassName,
                  {
                    [activeClassName]: borderType === "left",
                  },
                  "i-ant-design:border-left-outlined"
                )}
                onClick={() => setBorderType("left")}
              />
              <i
                className={classNames(
                  arcoIconClassName,
                  borderIconClassName,
                  {
                    [activeClassName]: borderType === "all",
                  },
                  "i-ant-design:border-outer-outlined"
                )}
                onClick={() => setBorderType("all")}
              />
              <i
                className={classNames(
                  arcoIconClassName,
                  borderIconClassName,
                  {
                    [activeClassName]: borderType === "right",
                  },
                  "i-ant-design:border-right-outlined"
                )}
                onClick={() => setBorderType("right")}
              />
            </div>
            <div className="flex justify-center">
              <i
                className={classNames(
                  arcoIconClassName,
                  borderIconClassName,
                  {
                    [activeClassName]: borderType === "bottom",
                  },
                  "i-ant-design:border-bottom-outlined"
                )}
                onClick={() => setBorderType("bottom")}
              />
            </div>
          </div>
          <Space className="flex-1" direction="vertical">
            <Select
              placeholder="选择边框类型"
              value={borderStyleDisplayValue}
              options={[
                { label: "实线", value: "solid" },
                { label: "点状", value: "dotted" },
                { label: "双线", value: "double" },
                { label: "虚线", value: "dashed" },
              ]}
              onChange={(val) => {
                handleChange("style", borderType, val, (value, dire) => {
                  if (val) {
                    if (borderType === "all") {
                      delEachBorder(value);
                    } else {
                      delAllBorder(value);
                    }
                  } else {
                    delete value["border" + dire + "Width"];
                    delete value["border" + dire + "Color"];
                  }
                });
              }}
              allowClear
            />
            {borderStyleDisplayValue && [
              <ColorInput
                value={borderColorDisplayValue || "auto"}
                onChange={(val) => {
                  handleChange("color", borderType, val);
                }}
                allowClear
                key="color"
              />,
              <InputNumber
                value={borderWidthDisplayValue}
                className="flex-1"
                min={0}
                suffix="px"
                step={1}
                precision={1}
                onChange={(val) => {
                  handleChange("width", borderType, val);
                }}
                placeholder="输入边框大小"
                key="width"
              />,
            ]}
          </Space>
        </Space>
      </Space>
    </Space>
  );
}
