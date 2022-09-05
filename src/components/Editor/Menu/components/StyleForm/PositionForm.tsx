import { produce } from "immer";
import { InputNumber, Select, Space } from "@arco-design/web-react";
import { CSSProperties } from "react";
import BoxInput, { ValueType } from "./BoxInput";

interface IProps {
  value?: CSSProperties;
  onChange?: (val: CSSProperties) => void;
}

export default function PositionForm({ value = {}, onChange }: IProps) {
  const { position, top, left, right, bottom, zIndex } = value;
  return (
    <Space direction="vertical">
      <Space>
        <label className="arco-form-label-item">定位类型</label>
        <Select
          value={position}
          onChange={(val) => {
            onChange(
              produce(value, (value) => {
                if (!val) {
                  delete value.top;
                  delete value.left;
                  delete value.right;
                  delete value.bottom;
                }
                value.position = val;
              })
            );
          }}
          options={[
            { label: "绝对定位", value: "absolute" },
            { label: "相对定位", value: "relative" },
            { label: "固定定位", value: "fixed" },
            { label: "粘性定位", value: "sticky" },
          ]}
          allowClear
          placeholder="选择定位类型"
          style={{ width: 220 }}
        />
      </Space>
      {position && (
        <BoxInput
          tip="Position"
          value={{ top, left, right, bottom } as ValueType}
          height={150}
          onChange={(val) => {
            onChange({
              ...value,
              ...val,
            });
          }}
        />
      )}
      <Space>
        <label className="arco-form-label-item">层叠顺序</label>
        <InputNumber
          precision={0}
          step={1}
          placeholder="输入层叠顺序"
          value={zIndex}
          onChange={(val) => {
            onChange({ ...value, zIndex: val });
          }}
        />
      </Space>
    </Space>
  );
}
