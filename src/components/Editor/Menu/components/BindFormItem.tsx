import { Form, FormItemProps, Select, Tooltip } from "@arco-design/web-react";
import { IconSwap } from "@arco-design/web-react/icon";
import { cloneElement, useMemo, useState } from "react";

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
  const [isBind, setIsBind] = useState(!!value?.isBind);
  const displayValue = useMemo(
    () => (isBind ? value?.name : value?.name || value),
    [value, isBind]
  );
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
        cloneElement(children, { ...rest, value: displayValue })
      )}
      <Tooltip content={isBind ? "切换为固定值" : "切换为绑定变量"}>
        <IconSwap
          className="ml-2 cursor-pointer"
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
  const noop = (v) => v;
  const formatter = rest.formatter || noop;
  const normalize = rest.normalize || noop;
  return (
    <Form.Item
      {...rest}
      normalize={(v, prevValue, allValues) =>
        v?.isBind ? v : normalize(v, prevValue, allValues)
      }
    >
      <BindFormItemChildrenWarpper
        triggerPropName={rest.triggerPropName}
        data={data}
      >
        {children}
      </BindFormItemChildrenWarpper>
    </Form.Item>
  );
}
