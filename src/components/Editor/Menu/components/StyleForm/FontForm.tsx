import { Radio, Slider, Space, Tooltip } from "@arco-design/web-react";
import classNames from "classnames";
import { CSSProperties } from "react";
import ColorInput from "./ColorInput";
import PercentOrFixedInput from "./PercentOrFixedInput";

const RadioGroup = Radio.Group;

const arcoIconClassName = "arco-icon arco-icon-select-all text-14px";

interface IProps {
  value?: CSSProperties;
  onChange?: (val: CSSProperties) => void;
}

const alignOptions = [
  {
    icon: "i-material-symbols:format-align-left",
    title: "左对齐",
    value: "left",
  },
  {
    icon: "i-material-symbols:format-align-center",
    title: "居中对齐",
    value: "right",
  },
  {
    icon: "i-material-symbols:format-align-right",
    title: "右对齐",
    value: "center",
  },
  {
    icon: "i-material-symbols:format-align-justify",
    title: "两端对齐",
    value: "justify",
  },
];

export default function FontForm({ value = {}, onChange }: IProps) {
  return (
    <Space direction="vertical" className="w-full">
      <Space>
        <label className="arco-form-label-item">字号</label>
        <PercentOrFixedInput
          min={12}
          suffix="px"
          step={1}
          precision={0}
          value={value.fontSize}
          onChange={(val) => {
            onChange({ ...value, fontSize: val });
          }}
        />
        <label className="arco-form-label-item">行高</label>
        <PercentOrFixedInput
          min={12}
          suffix="px"
          step={1}
          precision={0}
          value={value.lineHeight}
          onChange={(val) => {
            onChange({ ...value, lineHeight: val });
          }}
        />
      </Space>
      <Space>
        <label className="arco-form-label-item">粗细</label>
        <RadioGroup
          type="button"
          value={value.fontWeight}
          onChange={(val) => {
            onChange({ ...value, fontWeight: val });
          }}
          options={[
            {
              label: "细",
              value: "lighter",
            },
            {
              label: "正常",
              value: "normal",
            },
            {
              label: "粗",
              value: "bold",
            },
            {
              label: "很粗",
              value: "bolder",
            },
          ]}
        />
      </Space>
      <Space>
        <label className="arco-form-label-item">颜色</label>
        <ColorInput
          value={value.color || "auto"}
          onChange={(val) => {
            onChange({ ...value, color: val });
          }}
          allowClear
        />
      </Space>
      <Space>
        <label className="arco-form-label-item">对齐</label>
        <RadioGroup
          type="button"
          value={value.textAlign}
          onChange={(val) => {
            onChange({ ...value, textAlign: val });
          }}
          options={alignOptions.map((i) => ({
            label: (
              <Tooltip content={i.title}>
                <i className={classNames(arcoIconClassName, i.icon)} />
              </Tooltip>
            ),
            value: i.value,
          }))}
        />
      </Space>
      <Space size="large">
        <label className="arco-form-label-item">可见度</label>
        <Slider
          showInput
          value={(value.opacity || 100) as number}
          onChange={(val) => {
            onChange({ ...value, opacity: val as number });
          }}
          style={{ width: 220 }}
        />
      </Space>
    </Space>
  );
}
