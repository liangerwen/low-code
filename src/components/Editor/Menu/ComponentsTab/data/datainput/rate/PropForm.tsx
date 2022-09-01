import { produce } from "@/utils";
import {
  Form,
  Input,
  InputNumber,
  InputProps,
  RateProps,
  Select,
  Switch,
} from "@arco-design/web-react";
import { useCallback, useEffect } from "react";
import { ActionProps } from "../..";
import BindFormItem from "@/components/Editor/Menu/components/BindFormItem";
import IconModal from "@/components/Editor/Menu/components/IconModal";

const useForm = Form.useForm;

const PropForm = (props: ActionProps) => {
  const [form] = useForm<RateProps>();

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
      <BindFormItem data={props.schema.data} label="个数" field="value">
        <InputNumber placeholder="输入个数" min={0} step={1} precision={1} />
      </BindFormItem>
      <BindFormItem data={props.schema.data} label="总数" field="count">
        <InputNumber placeholder="输入总数" min={0} step={1} precision={0} />
      </BindFormItem>
      <BindFormItem
        data={props.schema.data}
        label="自定义图标"
        field="character"
      >
        <IconModal />
      </BindFormItem>
      <BindFormItem
        data={props.schema.data}
        label="笑脸分级"
        field="grading"
        extra={
          <span className="color-[rgb(var(--danger-6))]">
            设置此项后评分总数和自定义图标将会失效！
          </span>
        }
        triggerPropName="checked"
      >
        <Switch />
      </BindFormItem>
      <BindFormItem
        data={props.schema.data}
        label="半选"
        field="allowHalf"
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
    </Form>
  );
};

export default PropForm;
