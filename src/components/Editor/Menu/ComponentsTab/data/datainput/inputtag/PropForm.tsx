import { produce } from "immer";
import {
  Form,
  Input,
  InputTag,
  InputTagProps,
  Select,
  Switch,
} from "@arco-design/web-react";
import { useCallback, useEffect } from "react";
import { get } from "lodash";
import { ActionProps } from "../..";
import BindFormItem from "@/components/Editor/Menu/components/BindFormItem";
import IconModal from "@/components/Editor/Menu/components/IconModal";

const useForm = Form.useForm;
const FormItem = Form.Item;

const PropForm = (props: ActionProps) => {
  const [form] = useForm<InputTagProps>();

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
      <FormItem
        noStyle
        shouldUpdate={(pre, next) => pre.labelInValue !== next.labelInValue}
      >
        {(value) => (
          <BindFormItem data={props.schema.data} label="控件值" field="value">
            <InputTag
              placeholder="输入控件值"
              allowClear
              labelInValue={
                value.labelInValue?.isBind
                  ? get(props.schema.data, value.labelInValue.path)
                  : value.labelInValue
              }
            />
          </BindFormItem>
        )}
      </FormItem>
      <BindFormItem
        data={props.schema.data}
        label="输入框内容"
        field="inputValue"
      >
        <Input placeholder="输入内容" allowClear />
      </BindFormItem>
      <BindFormItem
        data={props.schema.data}
        label="提示文字"
        field="placeholder"
      >
        <Input placeholder="输入提示文字" allowClear />
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
      <BindFormItem data={props.schema.data} label="后缀图标" field="suffix">
        <IconModal />
      </BindFormItem>
      <BindFormItem
        data={props.schema.data}
        label="删除图标图标"
        field="icons.removeIcon"
      >
        <IconModal />
      </BindFormItem>
      <BindFormItem
        data={props.schema.data}
        label="清空图标"
        field="icons.clearIcon"
      >
        <IconModal />
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
        label="自动聚焦"
        field="autoFocus"
        triggerPropName="checked"
      >
        <Switch />
      </BindFormItem>
      <BindFormItem
        data={props.schema.data}
        label="拖拽排序"
        field="dragToSort"
        triggerPropName="checked"
      >
        <Switch />
      </BindFormItem>
      <BindFormItem
        data={props.schema.data}
        label="失焦时自动存储"
        field="saveOnBlur"
        triggerPropName="checked"
      >
        <Switch />
      </BindFormItem>
      <BindFormItem
        data={props.schema.data}
        label="对象值模式"
        field="labelInValue"
        triggerPropName="checked"
        extra="设置传入和回调出的值均为 { label: '', value: ''} 格式"
      >
        <Switch />
      </BindFormItem>
    </Form>
  );
};

export default PropForm;
