import BindFormItem from "@/components/Editor/Menu/components/BindFormItem";
import { produce } from "immer";
import { Form, Input, Select, Switch } from "@arco-design/web-react";
import { omit } from "lodash";
import { useCallback, useEffect } from "react";
import { ActionProps } from "../..";
import IconModal from "../../../../components/IconModal";

const useForm = Form.useForm;

interface LinkProps {
  status: "warning" | "error" | "success";
  content: string;
  icon: IconType;
  disabled: boolean;
  hoverable: boolean;
  href: string;
  target: boolean;
}

const PropForm = (props: ActionProps) => {
  const [form] = useForm<LinkProps>();

  const onChange = useCallback(
    (_, form) => {
      const newSchema = produce(props.component, (component) => {
        component.props = {
          ...component.props,
          ...omit(form, "content"),
        };
        component.children = form.content ? [form.content] : null;
      });
      props.onChange(newSchema);
    },
    [props]
  );

  useEffect(() => {
    const { props: p = { hoverable: true } } = props.component;
    form.resetFields();
    form.setFieldsValue({
      ...p,
      content: props.component.children?.[0] as string,
    });
  }, [props.component]);

  return (
    <Form form={form} layout="vertical" onChange={onChange}>
      <BindFormItem label="链接" field="href" data={props.schema.data}>
        <Input placeholder="输入链接" allowClear />
      </BindFormItem>
      <BindFormItem label="显示文字" field="content" data={props.schema.data}>
        <Input placeholder="输入显示文字" allowClear />
      </BindFormItem>
      <BindFormItem data={props.schema.data} label="状态" field="status">
        <Select
          placeholder="选择状态"
          allowClear
          options={[
            { label: "warning", value: "warning" },
            { label: "error", value: "error" },
            { label: "success", value: "success" },
          ]}
        />
      </BindFormItem>
      <BindFormItem
        data={props.schema.data}
        label="禁用"
        field="disabled"
        triggerPropName="checked"
      >
        <Switch />
      </BindFormItem>
      <BindFormItem
        data={props.schema.data}
        label="悬浮"
        field="hoverable"
        triggerPropName="checked"
      >
        <Switch />
      </BindFormItem>
      <BindFormItem data={props.schema.data} label="图标" field="icon">
        <IconModal />
      </BindFormItem>
      <BindFormItem
        data={props.schema.data}
        label="新标签打开"
        field="target"
        triggerPropName="checked"
        normalize={(val) => (val ? "_blank" : "_self")}
        formatter={(val) => val === "_blank"}
      >
        <Switch />
      </BindFormItem>
    </Form>
  );
};

export default PropForm;
