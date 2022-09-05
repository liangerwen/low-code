import BindFormItem from "@/components/Editor/Menu/components/BindFormItem";
import { produce } from "immer";
import {
  Form,
  Input,
  Select,
  SpaceProps,
  Switch,
} from "@arco-design/web-react";
import { useCallback, useEffect } from "react";
import { ActionProps } from "../..";

const FormItem = Form.Item;
const useForm = Form.useForm;

const PropForm = (props: ActionProps) => {
  const [form] = useForm<SpaceProps>();

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
    const { props: p = { direction: "horizontal" } } = props.component;
    form.resetFields();
    form.setFieldsValue(p);
  }, [props.component]);

  return (
    <Form form={form} layout="vertical" onChange={onChange}>
      <BindFormItem data={props.schema.data} label="间距方向" field="direction">
        <Select
          placeholder="选择间距方向"
          allowClear
          options={[
            { label: "horizontal", value: "horizontal" },
            { label: "vertical", value: "vertical" },
          ]}
        />
      </BindFormItem>
      <BindFormItem data={props.schema.data} label="对齐方式" field="align">
        <Select
          placeholder="选择对齐方式"
          allowClear
          options={[
            { label: "start", value: "start" },
            { label: "end", value: "end" },
            { label: "center", value: "center" },
            { label: "baseline", value: "baseline" },
          ]}
        />
      </BindFormItem>
      <BindFormItem data={props.schema.data} label="分隔符" field="split">
        <Input placeholder="输入分隔符" allowClear />
      </BindFormItem>
      <BindFormItem data={props.schema.data} label="大小" field="size">
        <Select
          placeholder="选择大小"
          allowClear
          options={[
            { label: "mini", value: "mini" },
            { label: "small", value: "small" },
            { label: "medium", value: "medium" },
            { label: "large", value: "large" },
          ]}
        />
      </BindFormItem>
      <BindFormItem
        data={props.schema.data}
        label="环绕"
        field="wrap"
        triggerPropName="checked"
      >
        <Switch />
      </BindFormItem>
    </Form>
  );
};

export default PropForm;
