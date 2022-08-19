import { forwardRef, useEffect, useImperativeHandle } from "react";
import EventContentWarp from "../EventContentWarp";
import MENUKEYS from "../../keys";
import { CopyFormType, FormPropsType, FormRefType } from "../../types";
import { Form, Input } from "@arco-design/web-react";

const { useForm, Item: FormItem } = Form;

const CopyForm = forwardRef<FormRefType, FormPropsType<CopyFormType>>(function (
  { value },
  ref
) {
  const [form] = useForm<CopyFormType>();

  useImperativeHandle(ref, () => ({
    validate: form.validate,
  }));

  useEffect(() => {
    form.resetFields();
    form.setFieldsValue(value);
  }, [value]);

  return (
    <EventContentWarp desc="复制内容">
      <Form form={form} layout="vertical">
        <FormItem
          field="content"
          label="复制内容"
          rules={[{ required: true, message: "请输入复制内容" }]}
        >
          <Input.TextArea placeholder="输入复制内容" allowClear />
        </FormItem>
      </Form>
    </EventContentWarp>
  );
});

export default {
  name: MENUKEYS.COPY,
  Form: CopyForm,
};
