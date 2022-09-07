import {
  forwardRef,
  useContext,
  useEffect,
  useImperativeHandle,
  useMemo,
} from "react";
import EventContentWarp from "../EventContentWarp";
import MENUKEYS from "../../keys";
import { FormPropsType, FormRefType, FormActionType } from "../../types";
import { Form, Radio, Select } from "@arco-design/web-react";
import { EditorContext } from "@/components/Editor";

const { useForm, Item: FormItem } = Form;
const { Group: RadioGroup } = Radio;

const FormAction = forwardRef<FormRefType, FormPropsType<FormActionType>>(
  function ({ value = {} }, ref) {
    const [form] = useForm<FormActionType>();

    const { forms } = useContext(EditorContext);

    const options = useMemo(
      () => Object.entries(forms).map((i) => ({ label: i[0], value: i[0] })),
      [forms]
    );

    useImperativeHandle(ref, () => ({
      validate: form.validate,
    }));

    useEffect(() => {
      form.resetFields();
      form.setFieldsValue(value);
    }, [value]);

    return (
      <EventContentWarp desc="表单">
        <Form form={form} layout="vertical">
          <FormItem
            field="id"
            label="表单ID"
            rules={[{ required: true, message: "请选择表单ID" }]}
          >
            <Select placeholder="选择表单ID" allowClear options={options} />
          </FormItem>
          <FormItem
            field="type"
            label="操作类型"
            rules={[{ required: true, message: "请选择操作类型" }]}
          >
            <RadioGroup type="button">
              <Radio value="submit">提交</Radio>
              <Radio value="validate">校验</Radio>
              <Radio value="clear">清空</Radio>
              <Radio value="reset">重置</Radio>
            </RadioGroup>
          </FormItem>
        </Form>
      </EventContentWarp>
    );
  }
);

export default {
  name: MENUKEYS.FORM,
  Form: FormAction,
};
