import BindFormItem from "@/components/Editor/Menu/components/BindFormItem";
import { produce } from "@/utils";
import {
  Form,
  FormItemProps,
  Grid,
  Input,
  Select,
  Switch,
  TypographyTextProps,
} from "@arco-design/web-react";
import { omit } from "lodash";
import { useCallback, useEffect } from "react";
import { ActionProps } from "../..";

const FormItem = Form.Item;
const useForm = Form.useForm;
const Row = Grid.Row;
const Col = Grid.Col;

type TextProps = Omit<
  TypographyTextProps & {
    blockquote: boolean;
    content: string;
    heading: 1 | 2 | 3 | 4 | 5 | 6;
  },
  "className" | "style" | "children" | "ellipsis"
>;

const PropForm = (props: ActionProps) => {
  const [form] = useForm<TextProps>();

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
    const { props: p = { heading: 1 }, children } = props.component;
    form.resetFields();
    form.setFieldsValue({
      ...p,
      content: children?.[0] as string,
    });
  }, [props.component]);

  return (
    <Form form={form} layout="vertical" onChange={onChange}>
      <BindFormItem label="内容" field="content" data={props.schema.data}>
        <Input.TextArea placeholder="输入内容" allowClear />
      </BindFormItem>
      <BindFormItem data={props.schema.data} label="类型" field="type">
        <Select
          placeholder="选择类型"
          allowClear
          options={[
            { label: "primary", value: "primary" },
            { label: "secondary", value: "secondary" },
            { label: "warning", value: "warning" },
            { label: "error", value: "error" },
            { label: "success", value: "success" },
          ]}
        />
      </BindFormItem>
      <BindFormItem data={props.schema.data} label="大小" field="heading">
        <Select
          placeholder="选择大小"
          allowClear
          options={[
            { label: "H1", value: 1 },
            { label: "H2", value: 2 },
            { label: "H3", value: 3 },
            { label: "H4", value: 4 },
            { label: "H5", value: 5 },
            { label: "H6", value: 6 },
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
        label="标记"
        field="mark"
        triggerPropName="checked"
      >
        <Switch />
      </BindFormItem>
      <BindFormItem
        data={props.schema.data}
        label="加粗"
        field="bold"
        triggerPropName="checked"
      >
        <Switch />
      </BindFormItem>
      <BindFormItem
        data={props.schema.data}
        label="代码块"
        field="code"
        triggerPropName="checked"
      >
        <Switch />
      </BindFormItem>
      <BindFormItem
        data={props.schema.data}
        label="下划线"
        field="underline"
        triggerPropName="checked"
      >
        <Switch />
      </BindFormItem>
      <BindFormItem
        data={props.schema.data}
        label="删除线"
        field="delete"
        triggerPropName="checked"
      >
        <Switch />
      </BindFormItem>
      <BindFormItem
        data={props.schema.data}
        label="可复制"
        field="copyable"
        triggerPropName="checked"
      >
        <Switch />
      </BindFormItem>
      <BindFormItem
        data={props.schema.data}
        disabled={!Boolean((props.component.children?.[0] as BindType)?.isBind)}
        label="可编辑"
        field="editable"
        triggerPropName="checked"
        normalize={(val) => (val ? {} : false)}
        formatter={(val) => Boolean(val)}
      >
        <Switch />
      </BindFormItem>
    </Form>
  );
};

export default PropForm;
