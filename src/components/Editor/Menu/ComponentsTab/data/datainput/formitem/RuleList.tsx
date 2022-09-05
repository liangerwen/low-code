import SortCardList from "@/components/Editor/Menu/components/SortCardList";
import { Button, Empty, RulesProps } from "@arco-design/web-react";
import { IconPlus } from "@arco-design/web-react/icon";
import { generate as uuid } from "shortid";
import { useMemo, useRef, useState } from "react";
import RuleModal from "./RuleModal";
import { produce } from "immer";

type ValueType = (Omit<RulesProps, "match"> & {
  id: string;
  match?: { isRegExp: true; source: string };
})[];
interface IProps {
  value?: ValueType;
  onChange?: (value: ValueType) => void;
}
const RuleTypeOptions = {
  string: "字符串",
  number: "数字",
  boolean: "布尔值",
  array: "数组",
  object: "对象",
  email: "邮箱地址",
  url: "链接",
  ip: "IP地址",
};
const RuleTypeOptionsArr = Object.entries(RuleTypeOptions).map((i) => ({
  value: i[0],
  label: i[1],
}));
export default function RuleList({ value = [], onChange }: IProps) {
  const [visible, setVisible] = useState(false);
  const [initialValues, setInitialValues] = useState(undefined);
  const typeRef = useRef("add");
  const displayValue = useMemo(
    () =>
      value.map((v) => ({
        id: v.id,
        name: v.type || "string",
      })),
    [value]
  );
  return (
    <div className="w-full">
      {displayValue.length === 0 ? (
        <Empty />
      ) : (
        <SortCardList
          value={displayValue}
          options={RuleTypeOptionsArr}
          onChange={(val) => {
            onChange?.(val.map((v) => value.find((vv) => vv.id === v.id)));
          }}
          onEdit={(val) => {
            typeRef.current = "edit";
            setInitialValues(value.find((v) => v.id === val.id));
            setVisible(true);
          }}
        />
      )}
      <Button
        icon={<IconPlus />}
        type="outline"
        long
        onClick={() => {
          typeRef.current = "add";
          setInitialValues(undefined);
          setVisible(true);
        }}
      >
        增加一条规则
      </Button>
      <RuleModal
        visible={visible}
        onOk={(val) => {
          if (typeRef.current === "add") {
            onChange?.([...value, { ...val, id: uuid() }]);
          } else {
            onChange?.(
              produce(value, (value) => {
                const idx = value.findIndex((v) => v.id === val.id);
                value.splice(idx, 1, val);
              })
            );
          }
          setVisible(false);
        }}
        onCancel={() => setVisible(false)}
        initialValues={initialValues}
      />
    </div>
  );
}
