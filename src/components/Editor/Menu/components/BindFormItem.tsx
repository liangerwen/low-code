import { Form, FormItemProps, Select, Tooltip } from "@arco-design/web-react";
import { IconSwap } from "@arco-design/web-react/icon";
import { cloneElement, useEffect, useMemo, useState } from "react";

function BindFormItemChildrenWarpper({
  children,
  data = {},
  triggerPropName,
  ...rest
}) {
  const value = useMemo(
    () => (triggerPropName ? rest[triggerPropName] : rest.value),
    [triggerPropName, rest]
  );
  const [isBind, setIsBind] = useState(false);
  const displayValue = useMemo(() => {
    if (isBind) {
      return value?.isBind && value?.name;
    }
    return value?.isBind ? data[value.name] : value;
  }, [value, isBind, data]);
  useEffect(() => {
    setIsBind(!!value?.isBind);
  }, [value]);
  return (
    // @ts-ignore
    <div className="w-full flex items-center">
      {isBind ? (
        <Select
          placeholder="选择变量"
          value={displayValue}
          allowClear
          onChange={(v) => {
            rest?.onChange(v && { isBind: true, name: v });
          }}
          options={Object.keys(data).map((i) => ({
            label: i,
            value: i,
          }))}
        />
      ) : (
        cloneElement(children, {
          ...rest,
          [triggerPropName || "value"]: displayValue,
        })
      )}
      <Tooltip content={isBind ? "切换为固定值" : "切换为绑定变量"}>
        <IconSwap
          className="ml-2 cursor-pointer color-[var(--color-text-1)]"
          onClick={() => setIsBind(!isBind)}
        />
      </Tooltip>
    </div>
  );
}

export default function BindFormItem({
  children,
  data,
  ...rest
}: FormItemProps & { data: Record<string, any> }) {
  return (
    <Form.Item {...rest}>
      <BindFormItemChildrenWarpper
        triggerPropName={rest.triggerPropName}
        data={data}
      >
        {children}
      </BindFormItemChildrenWarpper>
    </Form.Item>
  );
}
