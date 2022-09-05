import { produce } from "immer";
import {
  Form,
  Input,
  InputNumber,
  InputProps,
  InputTag,
  Select,
  SelectProps,
  Switch,
} from "@arco-design/web-react";
import { useCallback, useEffect } from "react";
import { ActionProps } from "../..";
import BindFormItem from "@/components/Editor/Menu/components/BindFormItem";
import IconModal from "@/components/Editor/Menu/components/IconModal";
import OptionInput from "@/components/Editor/Menu/components/OptionInput";
import { omit } from "lodash";

const useForm = Form.useForm;

const PropForm = (props: ActionProps) => {
  const [form] = useForm<SelectProps & { multiple: boolean }>();

  const onChange = useCallback(
    (_, form) => {
      const newSchema = produce(props.component, (component) => {
        component.props = { ...component.props, ...omit(form, "multiple") };
        if (form.multiple) {
          component.props.mode = "multiple";
        } else {
          delete component.props.mode;
        }
      });
      props.onChange(newSchema);
    },
    [props]
  );

  useEffect(() => {
    form.resetFields();
    form.setFieldsValue({
      ...omit(props.component.props, "mode"),
      multiple: props.component.props?.mode === "multiple",
    });
  }, [props.component]);

  return (
    <Form form={form} layout="vertical" onChange={onChange}>
      <BindFormItem
        data={props.schema.data}
        label="内容"
        field="value"
        shouldUpdate={(prev, next) => prev?.multiple !== next?.multiple}
      >
        {(value) => (
          <Select
            placeholder="选择内容"
            allowClear
            options={value.options}
            mode={value.multiple ? "multiple" : undefined}
          />
        )}
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
            { label: "large", value: "large" },
          ]}
          placeholder="选择尺寸"
          allowClear
        />
      </BindFormItem>
      <BindFormItem
        data={props.schema.data}
        label="没有选项时显示的内容"
        field="notFoundContent"
      >
        <Input placeholder="输入内容" allowClear />
      </BindFormItem>
      <BindFormItem
        data={props.schema.data}
        label="最多显示标签数"
        field="maxTagCount"
      >
        <InputNumber placeholder="输入标签数" min={1} precision={0} />
      </BindFormItem>
      <BindFormItem data={props.schema.data} label="选项" field="options">
        <OptionInput />
      </BindFormItem>
      <BindFormItem data={props.schema.data} label="清除图标" field="clearIcon">
        <IconModal />
      </BindFormItem>
      <BindFormItem data={props.schema.data} label="前缀" field="prefix">
        <IconModal />
      </BindFormItem>
      <BindFormItem
        data={props.schema.data}
        label="后缀图标"
        field="suffixIcon"
      >
        <IconModal />
      </BindFormItem>
      <BindFormItem data={props.schema.data} label="箭头图标" field="arrowIcon">
        <IconModal />
      </BindFormItem>
      <BindFormItem
        data={props.schema.data}
        label="多选时删除图标"
        field="removeIcon"
      >
        <IconModal />
      </BindFormItem>
      <BindFormItem
        data={props.schema.data}
        label="允许多选"
        field="multiple"
        triggerPropName="checked"
      >
        <Switch />
      </BindFormItem>
      <BindFormItem
        data={props.schema.data}
        label="允许输入新项"
        field="allowCreate"
        triggerPropName="checked"
      >
        <Switch />
      </BindFormItem>
      <BindFormItem
        data={props.schema.data}
        label="动画"
        field="animation"
        triggerPropName="checked"
      >
        <Switch />
      </BindFormItem>
      <BindFormItem
        data={props.schema.data}
        label="边框"
        field="bordered"
        triggerPropName="checked"
      >
        <Switch />
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
        label="允许筛选"
        field="filterOption"
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
    </Form>
  );
};

export default PropForm;
