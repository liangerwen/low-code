import { produce } from "@/utils";
import { Form, Grid, Input, Select, Switch } from "@arco-design/web-react";
import { omit } from "lodash";
import { useCallback, useEffect } from "react";
import IconModal from "../../../../components/IconModal";

const FormItem = Form.Item;
const useForm = Form.useForm;
const Row = Grid.Row;
const Col = Grid.Col;

interface ButtonProps {
  type: "text" | "primary" | "secondary" | "dashed" | "outline";
  status: "warning" | "danger" | "success";
  size: "mini" | "small" | "large";
  text: string;
  icon: string;
  shape: "circle" | "round" | "square";
  disabled: boolean;
  iconOnly: boolean;
  loading: boolean;
  long: boolean;
}

const PropForm = (props: {
  schema: IComponent;
  onChange: (schema: IComponent) => void;
}) => {
  const [form] = useForm<ButtonProps>();

  const onChange = useCallback(
    (_, form) => {
      const newSchema = produce(props.schema, (schema) => {
        schema.attrs = {
          ...schema.attrs,
          ...omit(form, "text"),
        };
        schema.inline = !form.long;
        schema.children = form.text ? [form.text] : null;
      });
      props.onChange(newSchema);
    },
    [props]
  );

  useEffect(() => {
    form.resetFields();
    form.setFieldsValue({
      ...props.schema.attrs,
      text: props.schema.children?.[0] as string,
    });
  }, [props.schema]);

  return (
    <Form form={form} layout="vertical" onChange={onChange}>
      <FormItem label="尺寸" field="size">
        <Select
          placeholder="选择尺寸"
          allowClear
          options={[
            { label: "mini", value: "mini" },
            { label: "small", value: "small" },
            { label: "large", value: "large" },
          ]}
        />
      </FormItem>
      <FormItem label="类型" field="type">
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
      </FormItem>
      <FormItem label="状态" field="status">
        <Select
          placeholder="选择状态"
          allowClear
          options={[
            { label: "warning", value: "warning" },
            { label: "danger", value: "danger" },
            { label: "success", value: "success" },
          ]}
        />
      </FormItem>
      <FormItem label="形状" field="shape">
        <Select
          placeholder="选择形状"
          allowClear
          options={[
            { label: "circle", value: "circle" },
            { label: "round", value: "round" },
            { label: "square", value: "square" },
          ]}
        />
      </FormItem>
      <FormItem label="内容" field="text">
        <Input placeholder="输入内容" allowClear />
      </FormItem>
      <Row>
        <Col span={12}>
          <FormItem
            label="是否禁用"
            field="disabled"
            layout="inline"
            labelAlign="left"
            triggerPropName="checked"
          >
            <Switch />
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem
            label="是否加载"
            field="loading"
            layout="inline"
            labelAlign="left"
            triggerPropName="checked"
          >
            <Switch />
          </FormItem>
        </Col>
      </Row>
      <FormItem label="图标" field="icon">
        <IconModal />
      </FormItem>
      <Row>
        <Col span={12}>
          <FormItem
            label="只有图标"
            field="iconOnly"
            layout="inline"
            labelAlign="left"
            triggerPropName="checked"
          >
            <Switch />
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem
            label="是否块级"
            field="long"
            layout="inline"
            labelAlign="left"
            triggerPropName="checked"
          >
            <Switch />
          </FormItem>
        </Col>
      </Row>
    </Form>
  );
};

export default PropForm;