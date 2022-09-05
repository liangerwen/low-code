import { produce } from "immer";
import { Input, Radio, Space, Tooltip } from "@arco-design/web-react";
import { IconBgColors, IconImage } from "@arco-design/web-react/icon";
import { CSSProperties, useEffect, useMemo, useState } from "react";
import ColorInput from "./ColorInput";

interface IProps {
  value?: CSSProperties;
  onChange?: (val: CSSProperties) => void;
}

const typeOptions = [
  { icon: <IconBgColors />, title: "颜色填充", value: "color" },
  { icon: <IconImage />, title: "背景颜色", value: "image" },
];

export default function BackgroundForm({ value = {}, onChange }: IProps) {
  const [type, setType] = useState("");
  useEffect(() => {
    if (value.backgroundColor) {
      setType("color");
    } else if (value.backgroundImage) {
      setType("image");
    } else setType("");
  }, [value.backgroundColor, value.backgroundImage]);

  const displayValue = useMemo(() => {
    if (!value.backgroundImage) return value.backgroundImage;
    const url = value.backgroundImage.split("url(")?.[1]?.split(")")?.[0];
    return url;
  }, [value.backgroundImage]);

  return (
    <Space direction="vertical">
      <Space>
        <label className="arco-form-label-item">背景类型</label>
        <Radio.Group
          type="button"
          value={type}
          onChange={setType}
          options={typeOptions.map((i) => ({
            label: <Tooltip content={i.title}>{i.icon}</Tooltip>,
            value: i.value,
          }))}
        />
      </Space>

      {type === "color" && (
        <Space>
          <label className="arco-form-label-item">背景颜色</label>
          <ColorInput
            value={value.backgroundColor || "无"}
            onChange={(val) => {
              onChange(
                produce(value, (value) => {
                  delete value.backgroundImage;
                  delete value.backgroundSize;
                  delete value.backgroundRepeat;
                  delete value.backgroundPosition;
                  value.backgroundColor = val;
                })
              );
            }}
            allowClear
          />
        </Space>
      )}
      {type === "image" && [
        <Space>
          <label className="arco-form-label-item">图片地址</label>
          <Input
            value={displayValue}
            onChange={(val) => {
              onChange(
                produce(value, (value) => {
                  if (value) {
                    delete value.backgroundColor;
                    value.backgroundImage = `url(${val})`;
                    value.backgroundSize = "100%";
                    value.backgroundRepeat = "no-repeat";
                    value.backgroundPosition = "center";
                  } else {
                    delete value.backgroundImage;
                    delete value.backgroundSize;
                    delete value.backgroundRepeat;
                    delete value.backgroundPosition;
                  }
                })
              );
            }}
            allowClear
            placeholder="输入图片URL"
          />
        </Space>,
      ]}
    </Space>
  );
}
