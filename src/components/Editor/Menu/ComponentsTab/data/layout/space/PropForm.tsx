import { produce } from "@/utils";
import {
  Form,
  Input,
  Select,
  SpaceProps,
  Switch,
} from "@arco-design/web-react";
import { useCallback, useEffect } from "react";

const FormItem = Form.Item;
const useForm = Form.useForm;

const PropForm = (props: {
  schema: IComponent;
  onChange: (schema: IComponent) => void;
}) => {
  const [form] = useForm<SpaceProps>();

  const onChange = useCallback(
    (_, form) => {
      const newSchema = produce(props.schema, (schema) => {
        schema.props = {
          ...schema.props,
          ...form,
        };
      });
      props.onChange(newSchema);
    },
    [props]
  );

  useEffect(() => {
    const { props: p = { direction: "horizontal" } } = props.schema;
    form.resetFields();
    form.setFieldsValue(p);
  }, [props.schema]);

  return (
    <Form form={form} layout="vertical" onChange={onChange}>
      <FormItem label="间距方向" field="direction">
        <Select
          placeholder="选择间距方向"
          allowClear
          options={[
            { label: "horizontal", value: "horizontal" },
            { label: "vertical", value: "vertical" },
          ]}
        />
      </FormItem>
      <FormItem label="对齐方式" field="align">
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
      </FormItem>
      <FormItem label="分隔符" field="split">
        <Input placeholder="输入分隔符" allowClear />
      </FormItem>
      <FormItem label="大小" field="size">
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
      </FormItem>
      <FormItem
        label="环绕"
        field="wrap"
        layout="inline"
        labelAlign="left"
        triggerPropName="checked"
      >
        <Switch />
      </FormItem>
    </Form>
  );
};

export default PropForm;
