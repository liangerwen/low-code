import { produce } from "@/utils";
import { DividerProps, Form, Input, Select } from "@arco-design/web-react";
import { omit } from "lodash";
import { ReactNode, useCallback, useEffect } from "react";
import { ActionProps } from "../..";

const FormItem = Form.Item;
const useForm = Form.useForm;

const PropForm = (props: ActionProps) => {
  const [form] = useForm<DividerProps & { content: ReactNode }>();

  const onChange = useCallback(
    (_, form) => {
      const newSchema = produce(props.component, (component) => {
        component.props = {
          ...component.props,
          ...omit(form, "content"),
        };
        component.inline = form.type === "vertical";
        component.children =
          !component.inline && (form.content ? [form.content] : null);
      });
      props.onChange(newSchema);
    },
    [props]
  );

  useEffect(() => {
    const { props: p = { type: "horizontal" } } = props.component;
    form.resetFields();
    form.setFieldsValue({
      ...p,
      content: props.component.children?.[0] as string,
    });
  }, [props.component]);

  return (
    <Form form={form} layout="vertical" onChange={onChange}>
      <FormItem label="类型" field="type">
        <Select
          placeholder="选择类型"
          allowClear
          options={[
            { label: "horizontal", value: "horizontal" },
            { label: "vertical", value: "vertical" },
          ]}
        />
      </FormItem>
      {props.component.props?.type === "horizontal" && (
        <FormItem label="内容" field="content">
          <Input placeholder="输入内容" allowClear />
        </FormItem>
      )}
      {props.component.children?.[0] && (
        <FormItem label="位置" field="orientation">
          <Select
            placeholder="选择位置"
            allowClear
            options={[
              { label: "left", value: "left" },
              { label: "right", value: "right" },
              { label: "center", value: "center" },
            ]}
          />
        </FormItem>
      )}
    </Form>
  );
};

export default PropForm;
