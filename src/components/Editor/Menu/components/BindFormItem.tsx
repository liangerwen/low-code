import { Cascader, Form, FormItemProps, Tooltip } from "@arco-design/web-react";
import { IconSwap } from "@arco-design/web-react/icon";
import { isEmpty, isPlainObject } from "lodash";
import { cloneElement, useEffect, useMemo, useState } from "react";

const objToOptions = (data) =>
  Object.keys(data).map((i) => {
    const value = data[i];
    return isPlainObject(value) && !isEmpty(value)
      ? {
          label: i,
          value: i,
          children: objToOptions(value),
        }
      : {
          label: i,
          value: i,
        };
  });

function BindFormItemChildrenWrapper({
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
      return value?.isBind && value?.path;
    }
    return value?.isBind ? value?.path?.join(".") : value;
  }, [value, isBind, data]);
  const options = useMemo(() => objToOptions(data), [data]);
  useEffect(() => {
    value && setIsBind(!!value?.isBind);
  }, [value]);
  return (
    // @ts-ignore
    <div className="w-full flex items-center">
      {isBind ? (
        <Cascader
          placeholder="选择变量"
          options={options}
          showSearch
          changeOnSelect
          allowClear
          value={displayValue}
          onChange={(v) => {
            rest?.onChange(v && { isBind: true, path: v });
          }}
        />
      ) : (
        children &&
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
      <BindFormItemChildrenWrapper
        triggerPropName={rest.triggerPropName}
        data={data}
      >
        {children}
      </BindFormItemChildrenWrapper>
    </Form.Item>
  );
}
