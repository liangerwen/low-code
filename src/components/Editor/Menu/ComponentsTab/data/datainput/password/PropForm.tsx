import { produce } from "immer";
import {
  Form,
  FormItemProps,
  Input,
  InputNumber,
  InputProps,
  Select,
  Switch,
} from "@arco-design/web-react";
import { useCallback, useEffect } from "react";
import { ActionProps } from "../..";
import BindFormItem from "@/components/Editor/Menu/components/BindFormItem";
import IconModal from "@/components/Editor/Menu/components/IconModal";

const useForm = Form.useForm;

const PropForm = (props: ActionProps) => {
  const [form] = useForm<InputProps>();

  const onChange = useCallback(
    (_, form) => {
      const newSchema = produce(props.component, (component) => {
        component.props = { ...component.props, ...form };
        if (form.visibility === false) {
          delete component.props.visibility;
        }
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
      <BindFormItem data={props.schema.data} label="前置标签" field="addBefore">
        <Input placeholder="输入前置标签" allowClear />
      </BindFormItem>
      <BindFormItem data={props.schema.data} label="后置标签" field="addAfter">
        <Input placeholder="输入后置标签" allowClear />
      </BindFormItem>
      <BindFormItem data={props.schema.data} label="高度" field="height">
        <InputNumber placeholder="输入高度" min={20} precision={0} />
      </BindFormItem>
      <BindFormItem
        data={props.schema.data}
        label="最大字符数"
        field="maxLength"
      >
        <InputNumber placeholder="输入最大字符数" min={0} precision={0} />
      </BindFormItem>
      <BindFormItem data={props.schema.data} label="前缀图标" field="prefix">
        <IconModal />
      </BindFormItem>
      <BindFormItem data={props.schema.data} label="后缀图标" field="suffix">
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
        label="显示"
        field="visibility"
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
