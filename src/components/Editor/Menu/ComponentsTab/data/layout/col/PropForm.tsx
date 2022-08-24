import { produce } from "@/utils";
import { ColProps, Form, InputNumber } from "@arco-design/web-react";
import { useCallback, useEffect } from "react";
import { ActionProps } from "../..";

const FormItem = Form.Item;
const useForm = Form.useForm;

const PropForm = (props: ActionProps) => {
  const [form] = useForm<ColProps>();

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
    const { props: p = { span: 24 } } = props.component;
    form.resetFields();
    form.setFieldsValue(p);
  }, [props.component]);

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
