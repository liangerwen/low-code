import BindFormItem from "@/components/Editor/Menu/components/BindFormItem";
import { produce } from "immer";
import { Form, Input, Select, Switch } from "@arco-design/web-react";
import { omit } from "lodash";
import { useCallback, useEffect } from "react";
import { ActionProps } from "../..";
import IconModal from "../../../../components/IconModal";

const useForm = Form.useForm;

interface ButtonProps {
  type: "text" | "primary" | "secondary" | "dashed" | "outline";
  status: "warning" | "danger" | "success";
  size: "mini" | "small" | "large";
  content: string;
  icon: string;
  shape: "circle" | "round" | "square";
  disabled: boolean;
  iconOnly: boolean;
  loading: boolean;
  long: boolean;
}

const PropForm = (props: ActionProps) => {
  const [form] = useForm<ButtonProps>();

  const onChange = useCallback(
    (_, form) => {
      const newSchema = produce(props.component, (component) => {
        component.props = {
          ...component.props,
          ...omit(form, "content"),
        };
        component.inline = !form.long;
        component.children = form.content ? [form.content] : null;
      });
      props.onChange(newSchema);
    },
    [props]
  );

  useEffect(() => {
    form.resetFields();
    form.setFieldsValue({
      ...props.component.props,
      content: props.component.children?.[0] as string,
    });
  }, [props.component]);

  return (
    <Form form={form} layout="vertical" onChange={onChange}>
      <BindFormItem data={props.schema.data} label="尺寸" field="size">
        <Select
          placeholder="选择尺寸"
          allowClear
          options={[
            { label: "mini", value: "mini" },
            { label: "small", value: "small" },
            { label: "large", value: "large" },
          ]}
        />
      </BindFormItem>
      <BindFormItem data={props.schema.data} label="类型" field="type">
        <Select
          placeholder="选择类型"
          allowClear
          options={[
            { label: "primary", value: "primary" },
            { label: "secondary", value: "secondary" },
            { label: "dashed", value: "dashed" },
            { label: "text", value: "text" },
            { label: "outline", value: "outline" },
          ]}
        />
      </BindFormItem>
      <BindFormItem data={props.schema.data} label="动作类型" field="htmlType">
        <Select
          placeholder="选择动作类型"
          allowClear
          options={[
            { label: "提交", value: "submit" },
            { label: "重置", value: "reset" },
          ]}
        />
      </BindFormItem>
      <BindFormItem data={props.schema.data} label="状态" field="status">
        <Select
          placeholder="选择状态"
          allowClear
          options={[
            { label: "warning", value: "warning" },
            { label: "danger", value: "danger" },
            { label: "success", value: "success" },
          ]}
        />
      </BindFormItem>
      <BindFormItem data={props.schema.data} label="形状" field="shape">
        <Select
          placeholder="选择形状"
          allowClear
          options={[
            { label: "circle", value: "circle" },
            { label: "round", value: "round" },
            { label: "square", value: "square" },
          ]}
        />
      </BindFormItem>
      <BindFormItem label="内容" field="content" data={props.schema.data}>
        <Input placeholder="输入内容" allowClear />
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
        label="加载"
        field="loading"
        triggerPropName="checked"
      >
        <Switch />
      </BindFormItem>
      <BindFormItem data={props.schema.data} label="图标" field="icon">
        <IconModal />
      </BindFormItem>
      <BindFormItem
        data={props.schema.data}
        label="只有图标"
        field="iconOnly"
        triggerPropName="checked"
      >
        <Switch />
      </BindFormItem>
      <BindFormItem
        data={props.schema.data}
        label="块级"
        field="long"
        triggerPropName="checked"
      >
        <Switch />
      </BindFormItem>
    </Form>
  );
};

export default PropForm;
