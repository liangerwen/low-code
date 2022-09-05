import BindFormItem from "@/components/Editor/Menu/components/BindFormItem";
import { produce } from "immer";
import { Form, InputNumber, RowProps, Select } from "@arco-design/web-react";
import { useCallback, useEffect } from "react";
import { ActionProps } from "../..";

const useForm = Form.useForm;

const PropForm = (props: ActionProps) => {
  const [form] = useForm<RowProps>();

  const onChange = useCallback(
    (_, form) => {
      const newSchema = produce(props.component, (component) => {
        component.props = {
          ...component.props,
          ...form,
        };
      });
      props.onChange(newSchema);
    },
    [props]
  );

  useEffect(() => {
    const { props: p = { align: "start", justify: "start", gutter: 0 } } =
      props.component;
    form.resetFields();
    form.setFieldsValue(p);
  }, [props.component]);

  return (
    <Form form={form} layout="vertical" onChange={onChange}>
      <BindFormItem
        data={props.schema.data}
        label="水平对齐方式"
        field="justify"
      >
        <Select
          allowClear
          options={[
            { label: "start", value: "start" },
            { label: "center", value: "center" },
            { label: "end", value: "end" },
            { label: "space-around", value: "space-around" },
            { label: "space-between", value: "space-between" },
          ]}
        />
      </BindFormItem>
      <BindFormItem data={props.schema.data} label="竖直对齐方式" field="align">
        <Select
          placeholder="选择竖直对齐方式"
          allowClear
          options={[
            { label: "start", value: "start" },
            { label: "center", value: "center" },
            { label: "end", value: "end" },
            { label: "stretch", value: "stretch" },
          ]}
        />
      </BindFormItem>
      <BindFormItem data={props.schema.data} label="栅格间隔" field="gutter">
        <InputNumber
          mode="button"
          suffix="px"
          placeholder="输入栅格间隔"
          min={0}
        />
      </BindFormItem>
    </Form>
  );
};

export default PropForm;
