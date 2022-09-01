import { produce } from "@/utils";
import {
  CheckboxGroupProps,
  Form,
  InputTag,
  Select,
  Switch,
} from "@arco-design/web-react";
import { useCallback, useEffect } from "react";
import { ActionProps } from "../..";
import BindFormItem from "@/components/Editor/Menu/components/BindFormItem";
import OptionInput from "@/components/Editor/Menu/components/OptionInput";

const useForm = Form.useForm;

const PropForm = (props: ActionProps) => {
  const [form] = useForm<CheckboxGroupProps<string | number>>();

  const onChange = useCallback(
    (_, form) => {
      const newSchema = produce(props.component, (component) => {
        component.props = { ...component.props, ...form };
      });
      props.onChange(newSchema);
    },
    [props]
  );

  useEffect(() => {
    form.resetFields();
    form.setFieldsValue(props.component.props);
  }, [props.component]);

  return (
    <Form form={form} layout="vertical" onChange={onChange}>
      <BindFormItem data={props.schema.data} label="选中的值" field="value">
        <InputTag placeholder="输入选中的值" allowClear />
      </BindFormItem>
      <BindFormItem data={props.schema.data} label="方向" field="direction">
        <Select
          placeholder="选择方向"
          allowClear
          options={[
            {
              label: "horizontal",
              value: "horizontal",
            },
            {
              label: "vertical",
              value: "vertical",
            },
          ]}
        />
      </BindFormItem>
      <BindFormItem data={props.schema.data} label="选项" field="options">
        <OptionInput />
      </BindFormItem>
      <BindFormItem
        data={props.schema.data}
        label="禁用"
        field="disabled"
        triggerPropName="checked"
      >
        <Switch />
      </BindFormItem>
    </Form>
  );
};

export default PropForm;
