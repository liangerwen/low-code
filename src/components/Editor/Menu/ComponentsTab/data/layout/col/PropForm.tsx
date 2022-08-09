import { produce } from "@/utils";
import { ColProps, Form, InputNumber, Select } from "@arco-design/web-react";
import { useCallback, useEffect } from "react";

const FormItem = Form.Item;
const useForm = Form.useForm;

const PropForm = (props: {
  schema: IComponent;
  onChange: (schema: IComponent) => void;
}) => {
  const [form] = useForm<ColProps>();

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
    const { props: p = { span: 24 } } = props.schema;
    form.resetFields();
    form.setFieldsValue(p);
  }, [props.schema]);

  return (
    <Form form={form} layout="vertical" onChange={onChange}>
      <FormItem label="占位格数" field="span">
        <InputNumber
          placeholder="输入占位格数"
          min={0}
          max={24}
          precision={0}
        />
      </FormItem>
      <FormItem label="右偏移格数" field="push">
        <InputNumber
          placeholder="输入右偏移格数"
          min={0}
          max={23}
          precision={0}
        />
      </FormItem>
      <FormItem label="左偏移格数" field="pull">
        <InputNumber
          placeholder="输入左偏移格数"
          min={0}
          max={23}
          precision={0}
        />
      </FormItem>
      <FormItem label="排序" field="order">
        <InputNumber placeholder="输入排序" min={0} precision={0} />
      </FormItem>
    </Form>
  );
};

export default PropForm;
