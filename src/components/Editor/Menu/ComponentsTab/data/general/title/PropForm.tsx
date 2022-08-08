import BindFormItem from "@/components/Editor/Menu/components/BindFormItem";
import { produce } from "@/utils";
import {
  EllipsisConfig,
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

const switchFormItemProps: Partial<FormItemProps> = {
  layout: "horizontal",
  labelAlign: "left",
  labelCol: { span: 14 },
  wrapperCol: { span: 10 },
  triggerPropName: "checked",
};

const PropForm = (props: {
  schema: IComponent;
  onChange: (schema: IComponent) => void;
}) => {
  const [form] = useForm<TextProps>();

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
    const { props: p = { heading: 1 }, children } = props.schema;
    form.resetFields();
    form.setFieldsValue({
      ...p,
      content: children?.[0] as string,
    });
  }, [props.schema]);

  return (
    <Form form={form} layout="vertical" onChange={onChange}>
      <BindFormItem label="内容" field="content">
        <Input.TextArea placeholder="输入内容" allowClear />
      </BindFormItem>
      <FormItem label="类型" field="type">
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
      </FormItem>
      <FormItem label="大小" field="heading">
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
      </FormItem>
      <Row>
        <Col span={12}>
          <FormItem label="禁用" field="disabled" {...switchFormItemProps}>
            <Switch />
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem label="标记" field="mark" {...switchFormItemProps}>
            <Switch />
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span={12}>
          <FormItem label="加粗" field="bold" {...switchFormItemProps}>
            <Switch />
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem label="代码块" field="code" {...switchFormItemProps}>
            <Switch />
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span={12}>
          <FormItem label="下划线" field="underline" {...switchFormItemProps}>
            <Switch />
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem label="删除线" field="delete" {...switchFormItemProps}>
            <Switch />
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span={12}>
          <FormItem label="可复制" field="copyable" {...switchFormItemProps}>
            <Switch />
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem
            disabled={
              !Boolean((props.schema.children?.[0] as BindType)?.isBind)
            }
            label="可编辑"
            field="editable"
            {...switchFormItemProps}
            normalize={(val) => (val ? {} : false)}
            formatter={(val) => Boolean(val)}
          >
            <Switch />
          </FormItem>
        </Col>
      </Row>
    </Form>
  );
};

export default PropForm;