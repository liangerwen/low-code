import { produce } from "immer";
import {
  Form,
  FormProps,
  InputNumber,
  Select,
  Switch,
} from "@arco-design/web-react";
import { useCallback, useEffect } from "react";
import { ActionProps } from "../..";
import IdInput from "@/components/Editor/Menu/components/IdInput";
import BindFormItem from "@/components/Editor/Menu/components/BindFormItem";

const useForm = Form.useForm;

const PropForm = (props: ActionProps) => {
  const [form] = useForm<FormProps>();

  const onChange = useCallback(
    (_, form) => {
      const newSchema = produce(props.component, (component) => {
        const { labelCol, wrapperCol } = form;
        component.props = {
          ...component.props,
          ...form,
        };
        if (!labelCol?.span && !labelCol?.offset) {
          delete component.props.labelCol;
        }
        if (!wrapperCol?.span && !wrapperCol?.offset) {
          delete component.props.wrapperCol;
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
      <BindFormItem
        data={props.schema.data}
        label="ID"
        field="id"
        extra={
          <span className="color-[rgb(var(--danger-6))]">
            只有填写ID的表单才会被页面收集！
            <br />
            保证ID唯一，否则将会被覆盖！
          </span>
        }
      >
        <IdInput placeholder="输入ID" allowClear />
      </BindFormItem>
      <BindFormItem data={props.schema.data} label="布局" field="layout">
        <Select
          options={[
            {
              label: "水平",
              value: "horizontal",
            },
            {
              label: "垂直",
              value: "vertical",
            },
            {
              label: "多列",
              value: "inline",
            },
          ]}
          placeholder="选择布局"
          allowClear
        />
      </BindFormItem>
      <BindFormItem
        data={props.schema.data}
        label="标签对齐方式"
        field="labelAlign"
      >
        <Select
          options={[
            {
              label: "左对齐",
              value: "left",
            },
            {
              label: "右对齐",
              value: "right",
            },
          ]}
          placeholder="选择标签对齐方式"
          allowClear
        />
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
      <BindFormItem
        data={props.schema.data}
        label="标签占位格数"
        field="labelCol.span"
      >
        <InputNumber
          placeholder="输入标签占位格数"
          min={0}
          max={24}
          precision={0}
        />
      </BindFormItem>
      <BindFormItem
        data={props.schema.data}
        label="标签偏移数"
        field="labelCol.offset"
      >
        <InputNumber
          placeholder="输入标签偏移数"
          min={0}
          max={24}
          precision={0}
        />
      </BindFormItem>
      <BindFormItem
        data={props.schema.data}
        label="内容占位格数"
        field="wrapperCol.span"
      >
        <InputNumber
          placeholder="输入内容占位格数"
          min={0}
          max={24}
          precision={0}
        />
      </BindFormItem>
      <BindFormItem
        data={props.schema.data}
        label="内容偏移数"
        field="wrapperCol.offset"
      >
        <InputNumber
          placeholder="输入内容偏移数"
          min={0}
          max={24}
          precision={0}
        />
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
        label="冒号"
        field="colon"
        triggerPropName="checked"
      >
        <Switch />
      </BindFormItem>
    </Form>
  );
};

export default PropForm;
