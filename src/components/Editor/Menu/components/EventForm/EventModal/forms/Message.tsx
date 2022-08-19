import { forwardRef, useEffect, useImperativeHandle } from "react";
import EventContentWarp from "../EventContentWarp";
import MENUKEYS from "../../keys";
import { FormPropsType, FormRefType, MessageFormType } from "../../types";
import { Form, Input, InputNumber, Radio } from "@arco-design/web-react";

const { useForm, Item: FormItem } = Form;
const { Group: RadioGroup } = Radio;

const MessageForm = forwardRef<FormRefType, FormPropsType<MessageFormType>>(
  function ({ value = {} }, ref) {
    const [form] = useForm<MessageFormType>();

    useImperativeHandle(ref, () => ({
      validate: form.validate,
    }));

    useEffect(() => {
      form.resetFields();
      form.setFieldsValue(value);
    }, [value]);

    return (
      <EventContentWarp desc="消息提醒">
        <Form form={form} layout="vertical">
          <FormItem
            field="type"
            label="消息模式"
            rules={[{ required: true, message: "请选择消息模式" }]}
          >
            <RadioGroup type="button">
              <Radio value="message">全局提示</Radio>
              <Radio value="notice">通知提醒框</Radio>
            </RadioGroup>
          </FormItem>

          <FormItem
            shouldUpdate={(prev, next) => prev.type !== next.type}
            noStyle
          >
            {(value: MessageFormType) => (
              <FormItem field="status" label="消息状态">
                <RadioGroup type="button">
                  <Radio value="info">信息</Radio>
                  <Radio value="success">成功</Radio>
                  <Radio value="warning">警告</Radio>
                  <Radio value="error">错误</Radio>
                  {value.type === "message" && (
                    <Radio value="loading">加载</Radio>
                  )}
                </RadioGroup>
              </FormItem>
            )}
          </FormItem>
          <FormItem
            shouldUpdate={(prev, next) => prev.type !== next.type}
            noStyle
          >
            {(value: MessageFormType) =>
              value.type === "notice" && (
                <FormItem
                  field="title"
                  label="消息标题"
                  rules={[{ required: true, message: "请输入消息标题" }]}
                >
                  <Input placeholder="输入消息标题" allowClear />
                </FormItem>
              )
            }
          </FormItem>
          <FormItem
            field="content"
            label="消息内容"
            rules={[{ required: true, message: "请输入消息内容" }]}
          >
            <Input.TextArea placeholder="输入消息内容" allowClear />
          </FormItem>
          <FormItem field="duration" label="消息时长">
            <InputNumber
              className="w-200px"
              placeholder="输入消息时长"
              suffix="毫秒"
              step={500}
              precision={0}
              min={0}
            />
          </FormItem>
        </Form>
      </EventContentWarp>
    );
  }
);

export default {
  name: MENUKEYS.MESSAGE,
  Form: MessageForm,
};
