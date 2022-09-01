import { produce } from "@/utils";
import {
  Form,
  Input,
  Select,
  Switch,
  SwitchProps,
} from "@arco-design/web-react";
import { useCallback, useEffect } from "react";
import { ActionProps } from "../..";
import BindFormItem from "@/components/Editor/Menu/components/BindFormItem";
import IconModal from "@/components/Editor/Menu/components/IconModal";

const useForm = Form.useForm;

const PropForm = (props: ActionProps) => {
  const [form] = useForm<SwitchProps>();

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
      <BindFormItem
        data={props.schema.data}
        label="打开"
        field="checked"
        triggerPropName="checked"
      >
        <Switch />
      </BindFormItem>
      <BindFormItem data={props.schema.data} label="尺寸" field="size">
        <Select
          options={[
            { label: "small", value: "small" },
            { label: "default", value: "default" },
          ]}
          placeholder="选择尺寸"
          allowClear
        />
      </BindFormItem>
      <BindFormItem data={props.schema.data} label="类型" field="type">
        <Select
          options={[
            { label: "circle", value: "circle" },
            { label: "round", value: "round" },
            { label: "line", value: "line" },
          ]}
          placeholder="选择类型"
          allowClear
        />
      </BindFormItem>
      <BindFormItem
        data={props.schema.data}
        label="打开时按钮图标"
        field="checkedIcon"
      >
        <IconModal />
      </BindFormItem>
      <BindFormItem
        data={props.schema.data}
        label="关闭时按钮图标"
        field="uncheckedIcon"
      >
        <IconModal />
      </BindFormItem>
      <BindFormItem
        data={props.schema.data}
        label="打开时文案"
        field="checkedText"
      >
        <Input placeholder="输入打开时文案" allowClear />
      </BindFormItem>
      <BindFormItem
        data={props.schema.data}
        label="关闭时文案"
        field="uncheckedText"
      >
        <Input placeholder="输入打开时文案" allowClear />
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
    </Form>
  );
};

export default PropForm;
