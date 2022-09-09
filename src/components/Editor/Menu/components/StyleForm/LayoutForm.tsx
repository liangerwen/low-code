import { Radio, Space, Tooltip } from "@arco-design/web-react";
import classNames from "classnames";
import { CSSProperties, useMemo } from "react";
import BoxInput from "./BoxInput";
import PercentOrFixedInput from "./PercentOrFixedInput";

const RadioGroup = Radio.Group;

const arcoIconClassName = "arco-icon arco-icon-select-all text-14px";

interface IProps {
  value?: CSSProperties;
  onChange?: (val: CSSProperties) => void;
}

const displayOptions = [
  {
    icon: "i-cil:text",
    title: "内联",
    value: "inline",
  },
  {
    icon: "i-ic:outline-check-box-outline-blank",
    title: "块级",
    value: "block",
  },
  {
    icon: "i-gg:display-flex",
    title: "弹性",
    value: "flex",
  },
  {
    icon: "i-radix-icons:columns",
    title: "内联块",
    value: "inline-block",
  },
  {
    icon: "i-gg:display-flex",
    title: "内联弹性",
    value: "inline-flex",
  },
  {
    icon: "i-ri:eye-off-line",
    title: "隐藏",
    value: "none",
  },
];

const directionOptions = [
  {
    icon: "i-fluent:text-direction-horizontal-right-24-filled",
    title: "水平方向，起点在左侧",
    value: "row",
  },
  {
    icon: "i-fluent:text-direction-horizontal-left-24-filled",
    title: "水平方向，起点在右侧",
    value: "row-reverse",
  },
  {
    icon: "i-fluent:text-direction-vertical-24-filled",
    title: "垂直方向，起点在顶部",
    value: "column",
  },
  {
    icon: "i-fluent:text-direction-rotate-90-left-24-filled",
    title: "垂直方向，起点在底部",
    value: "column-reverse",
  },
];
const rowAlignOptions = [
  {
    icon: "i-lucide:align-horizontal-justify-start",
    title: "起点对齐",
    value: "flex-start",
  },
  {
    icon: "i-lucide:align-horizontal-justify-end",
    title: "终点对齐",
    value: "flex-end",
  },
  {
    icon: "i-lucide:align-horizontal-justify-center",
    title: "中点对齐",
    value: "center",
  },
  {
    icon: "i-lucide:align-horizontal-space-between",
    title: "两端对齐",
    value: "space-between",
  },
  {
    icon: "i-lucide:align-horizontal-space-around",
    title: "横向平分",
    value: "space-around",
  },
];
const colAlignOptions = [
  {
    icon: "i-lucide:align-start-horizontal",
    title: "起点对齐",
    value: "flex-start",
  },
  {
    icon: "i-lucide:align-end-horizontal",
    title: "终点对齐",
    value: "flex-end",
  },
  {
    icon: "i-lucide:align-vertical-justify-center",
    title: "中点对齐",
    value: "center",
  },
  {
    icon: "i-lucide:baseline",
    title: "基线对齐",
    value: "baseline",
  },
  {
    icon: "i-fluent:align-stretch-vertical-20-filled",
    title: "沾满容器整个高度",
    value: "stretch",
  },
];

export default function LayoutForm({ value = {}, onChange }: IProps) {
  const marginValue = useMemo(() => {
    return {
      top: value.marginTop as number,
      left: value.marginLeft as number,
      right: value.marginRight as number,
      bottom: value.marginBottom as number,
    };
  }, [
    value.marginTop,
    value.marginLeft,
    value.marginRight,
    value.marginBottom,
  ]);
  const paddingValue = useMemo(() => {
    return {
      top: value.paddingTop as number,
      left: value.paddingLeft as number,
      right: value.paddingRight as number,
      bottom: value.paddingBottom as number,
    };
  }, [
    value.paddingTop,
    value.paddingLeft,
    value.paddingRight,
    value.paddingBottom,
  ]);
  return (
    <Space direction="vertical" className="w-full">
      <Space>
        <label className="arco-form-label-item">模式</label>
        <RadioGroup
          type="button"
          value={value.display}
          onChange={(val) => {
            onChange({ ...value, display: val });
          }}
          options={displayOptions.map((i) => ({
            label: (
              <Tooltip content={i.title}>
                <i className={classNames(arcoIconClassName, i.icon)} />
              </Tooltip>
            ),
            value: i.value,
          }))}
        />
      </Space>
      {["flex", "inline-flex"].includes(value.display) && [
        <Space>
          <label className="arco-form-label-item">主轴方向</label>
          <RadioGroup
            type="button"
            value={value.flexDirection}
            onChange={(val) => {
              onChange({ ...value, flexDirection: val });
            }}
            options={directionOptions.map((i) => ({
              label: (
                <Tooltip content={i.title}>
                  <i className={classNames(arcoIconClassName, i.icon)} />
                </Tooltip>
              ),
              value: i.value,
            }))}
          />
        </Space>,
        <Space>
          <label className="arco-form-label-item">主轴对齐</label>
          <RadioGroup
            type="button"
            value={value.justifyContent}
            onChange={(val) => {
              onChange({ ...value, justifyContent: val });
            }}
            options={rowAlignOptions.map((i) => ({
              label: (
                <Tooltip content={i.title}>
                  <i className={classNames(arcoIconClassName, i.icon)} />
                </Tooltip>
              ),
              value: i.value,
            }))}
          />
        </Space>,
        <Space>
          <label className="arco-form-label-item">辅轴对齐</label>
          <RadioGroup
            type="button"
            value={value.alignItems}
            onChange={(val) => {
              onChange({ ...value, alignItems: val });
            }}
            options={colAlignOptions.map((i) => ({
              label: (
                <Tooltip content={i.title}>
                  <i className={classNames(arcoIconClassName, i.icon)} />
                </Tooltip>
              ),
              value: i.value,
            }))}
          />
        </Space>,
        <Space>
          <label className="arco-form-label-item">换行</label>
          <RadioGroup
            type="button"
            value={value.flexWrap}
            onChange={(val) => {
              onChange({ ...value, flexWrap: val });
            }}
            options={[
              { label: "不换行", value: "nowrap" },
              { label: "正换行", value: "wrap" },
              { label: "逆换行", value: "wrap-reverse" },
            ]}
          />
        </Space>,
      ]}
      <BoxInput
        height={150}
        tip="Margin"
        value={marginValue}
        onChange={(val) => {
          const { top, left, right, bottom } = val;
          onChange({
            ...value,
            marginTop: top,
            marginLeft: left,
            marginRight: right,
            marginBottom: bottom,
          });
        }}
      >
        <div className="w-full h-full box-border p-2">
          <BoxInput
            tip="Padding"
            value={paddingValue}
            onChange={(val) => {
              const { top, left, right, bottom } = val;
              onChange({
                ...value,
                paddingTop: top,
                paddingLeft: left,
                paddingRight: right,
                paddingBottom: bottom,
              });
            }}
          />
        </div>
      </BoxInput>
      <Space>
        <label className="arco-form-label-item">宽度</label>
        <PercentOrFixedInput
          min={0}
          suffix="px"
          step={1}
          value={value.width}
          onChange={(val) => {
            onChange({ ...value, width: val });
          }}
        />
        <label className="arco-form-label-item">高度</label>
        <PercentOrFixedInput
          min={0}
          suffix="px"
          step={1}
          value={value.height}
          onChange={(val) => {
            onChange({ ...value, height: val });
          }}
        />
      </Space>
    </Space>
  );
}
