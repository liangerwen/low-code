import { produce } from "immer";
import {
  Form,
  Input,
  InputNumber,
  InputNumberProps,
  Select,
  Switch,
} from "@arco-design/web-react";
import { useCallback, useEffect } from "react";
import { ActionProps } from "../..";
import BindFormItem from "@/components/Editor/Menu/components/BindFormItem";
import IconModal from "@/components/Editor/Menu/components/IconModal";

const useForm = Form.useForm;

const PropForm = (props: ActionProps) => {
  const [form] = useForm<InputNumberProps>();

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
      <BindFormItem data={props.schema.data} label="值" field="value">
        <InputNumber placeholder="输入值" />
      </BindFormItem>
      <BindFormItem
        data={props.schema.data}
        label="提示文字"
        field="placeholder"
      >
        <Input placeholder="输入提示文字" allowClear />
      </BindFormItem>
      <BindFormItem data={props.schema.data} label="最小值" field="min">
        <InputNumber placeholder="输入最小值" />
      </BindFormItem>
      <BindFormItem data={props.schema.data} label="最大值" field="max">
        <InputNumber placeholder="输入最大值" />
      </BindFormItem>
      <BindFormItem data={props.schema.data} label="精度" field="precision">
        <InputNumber placeholder="输入精度" precision={0} />
      </BindFormItem>
      <BindFormItem data={props.schema.data} label="步长" field="step">
        <InputNumber placeholder="输入步长" />
      </BindFormItem>
      <BindFormItem data={props.schema.data} label="尺寸" field="size">
        <Select
          options={[
            { label: "mini", value: "mini" },
            { label: "small", value: "small" },
            { label: "medium", value: "medium" },
            { label: "large", value: "large" },
          ]}
          placeholder="选择尺寸"
          allowClear
        />
      </BindFormItem>
      <BindFormItem data={props.schema.data} label="模式" field="mode">
        <Select
          options={[
            { label: "内嵌模式", value: "embed" },
            { label: "按钮模式", value: "button" },
          ]}
          placeholder="选择模式"
          allowClear
        />
      </BindFormItem>
      <BindFormItem data={props.schema.data} label="前缀" field="prefix">
        <Input placeholder="输入前缀" allowClear />
      </BindFormItem>
      <BindFormItem data={props.schema.data} label="后缀" field="suffix">
        <Input placeholder="输入后缀" allowClear />
      </BindFormItem>
      <BindFormItem data={props.schema.data} label="上图标" field="icons.up">
        <IconModal />
      </BindFormItem>
      <BindFormItem data={props.schema.data} label="下图标" field="icons.down">
        <IconModal />
      </BindFormItem>
      <BindFormItem data={props.schema.data} label="加图标" field="icons.plus">
        <IconModal />
      </BindFormItem>
      <BindFormItem data={props.schema.data} label="减图标" field="icons.minus">
        <IconModal />
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
      <BindFormItem
        data={props.schema.data}
        label="隐藏右侧按钮"
        field="hideControl"
        triggerPropName="checked"
      >
        <Switch />
      </BindFormItem>
    </Form>
  );
};

export default PropForm;
