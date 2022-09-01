import { produce } from "@/utils";
import {
  Form,
  Input,
  InputNumber,
  InputProps,
  Switch,
  TextAreaProps,
} from "@arco-design/web-react";
import { useCallback, useEffect } from "react";
import { ActionProps } from "../..";
import BindFormItem from "@/components/Editor/Menu/components/BindFormItem";

const useForm = Form.useForm;

const PropForm = (props: ActionProps) => {
  const [form] = useForm<TextAreaProps>();

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
      <BindFormItem data={props.schema.data} label="内容" field="value">
        <Input placeholder="输入内容" allowClear />
      </BindFormItem>
      <BindFormItem
        data={props.schema.data}
        label="提示文字"
        field="placeholder"
      >
        <Input placeholder="输入提示文字" allowClear />
      </BindFormItem>
      <BindFormItem
        data={props.schema.data}
        label="最大字符数"
        field="maxLength"
      >
        <InputNumber placeholder="输入最大字符数" min={0} precision={0} />
      </BindFormItem>
      <BindFormItem
        data={props.schema.data}
        label="允许清空"
        field="allowClear"
        triggerPropName="checked"
      >
        <Switch />
      </BindFormItem>
      <BindFormItem
        data={props.schema.data}
        label="自动调整高度"
        field="autoSize"
        triggerPropName="checked"
      >
        <Switch />
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
        label="只读"
        field="readOnly"
        triggerPropName="checked"
      >
        <Switch />
      </BindFormItem>
      <Form.Item
        shouldUpdate={(prev, next) => prev.maxLength !== next.maxLength}
        noStyle
      >
        {(value: InputProps) =>
          value.maxLength !== undefined && (
            <BindFormItem
              data={props.schema.data}
              label="显示最大字符数"
              field="showWordLimit"
              triggerPropName="checked"
            >
              <Switch />
            </BindFormItem>
          )
        }
      </Form.Item>
    </Form>
  );
};

export default PropForm;
