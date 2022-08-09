import {
  Form,
  FormItemProps,
  Radio,
  Select,
  Space,
} from "@arco-design/web-react";
import { cloneElement, useMemo, useState } from "react";
const RadioGroup = Radio.Group;

const data = { a: 1, b: 2 };

function BindFormItemChildrenWarpper({ children, triggerPropName, ...rest }) {
  const value = useMemo(() => {
    const v = triggerPropName ? rest[triggerPropName] : rest.value;
    return Object.values(data).includes(v) ? v : undefined;
  }, [triggerPropName, rest]);
  const [isBind, setIsBind] = useState(false);
  return (
    // @ts-ignore
    <Space direction="vertical" className="w-full">
      <RadioGroup
        type="button"
        value={isBind}
        options={[
          {
            label: "固定值",
            value: false,
          },
          {
            label: "绑定变量",
            value: "true",
          },
        ]}
        onChange={setIsBind}
      />
      {isBind ? (
        <Select
          placeholder="选择变量"
          value={value}
          allowClear
          onChange={(v) => {
            rest?.onChange(v && { isBind: true, name: v });
          }}
          options={Object.keys(data).map((i) => ({
            label: i,
            value: data[i],
          }))}
        />
      ) : (
        cloneElement(children, rest)
      )}
    </Space>
  );
}

export default function BindFormItem({ children, ...rest }: FormItemProps) {
  return (
    <Form.Item {...rest} formatter={(v) => (v?.isBind ? v.name : v)}>
      <BindFormItemChildrenWarpper triggerPropName={rest.triggerPropName}>
        {children}
      </BindFormItemChildrenWarpper>
    </Form.Item>
  );
}
