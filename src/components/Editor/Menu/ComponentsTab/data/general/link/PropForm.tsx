import { produce } from "@/utils";
import { Form, Grid, Input, Select, Switch } from "@arco-design/web-react";
import { omit } from "lodash";
import { useCallback, useEffect } from "react";
import IconModal from "../../../../components/IconModal";

const FormItem = Form.Item;
const useForm = Form.useForm;
const Row = Grid.Row;
const Col = Grid.Col;

interface LinkProps {
  status: "warning" | "error" | "success";
  content: string;
  icon: IconType;
  disabled: boolean;
  hoverable: boolean;
  href: string;
  target: boolean;
}

const PropForm = (props: {
  schema: IComponent;
  onChange: (schema: IComponent) => void;
}) => {
  const [form] = useForm<LinkProps>();

  const onChange = useCallback(
    (_, form) => {
      const newSchema = produce(props.schema, (schema) => {
        schema.props = {
          ...schema.props,
          ...omit(form, "content"),
        };
        schema.children = form.content ? [form.content] : null;
      });
      props.onChange(newSchema);
    },
    [props]
  );

  useEffect(() => {
    const { props: p = { hoverable: true } } = props.schema;
    form.resetFields();
    form.setFieldsValue({
      ...p,
      content: props.schema.children?.[0] as string,
    });
  }, [props.schema]);

  return (
    <Form form={form} layout="vertical" onChange={onChange}>
      <FormItem label="链接" field="href">
        <Input placeholder="输入链接" allowClear />
      </FormItem>
      <FormItem label="显示文字" field="content">
        <Input placeholder="输入显示文字" allowClear />
      </FormItem>
      <FormItem label="状态" field="status">
        <Select
          placeholder="选择状态"
          allowClear
          options={[
            { label: "warning", value: "warning" },
            { label: "error", value: "error" },
            { label: "success", value: "success" },
          ]}
        />
      </FormItem>
      <Row>
        <Col span={12}>
          <FormItem
            label="禁用"
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
            label="悬浮"
            field="hoverable"
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
      <FormItem
        label="新标签打开"
        field="target"
        triggerPropName="checked"
        normalize={(val) => (val ? "_blank" : "_self")}
        formatter={(val) => val === "_blank"}
      >
        <Switch />
      </FormItem>
    </Form>
  );
};

export default PropForm;
