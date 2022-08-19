import { forwardRef, useEffect, useImperativeHandle } from "react";
import EventContentWarp from "../EventContentWarp";
import MENUKEYS from "../../keys";
import { FormPropsType, FormRefType, OpenPageFormType } from "../../types";
import { Form, Input, Radio, Select, Switch } from "@arco-design/web-react";
import UrlParamsInput from "../../../UrlParamsInput";
import { produce } from "@/utils";

const { useForm, Item: FormItem } = Form;
const { Group: RadioGroup } = Radio;

const OpenPageForm = forwardRef<FormRefType, FormPropsType<OpenPageFormType>>(
  function ({ value = {} }, ref) {
    const [form] = useForm<OpenPageFormType>();

    useImperativeHandle(ref, () => ({
      validate: () =>
        form.validate().then((value) =>
          produce(value, (value) => {
            if (value.params) {
              value.params = value.params.filter((i) => i.key && i.value);
            }
          })
        ),
    }));

    useEffect(() => {
      form.resetFields();
      form.setFieldsValue(value);
    }, [value]);

    return (
      <EventContentWarp desc="打开新页面">
        <Form form={form} layout="vertical">
          <FormItem
            field="type"
            label="打开模式"
            rules={[{ required: true, message: "请选择打开模式" }]}
          >
            <RadioGroup type="button">
              <Radio value="page">打开页面</Radio>
              <Radio value="link">跳转链接</Radio>
            </RadioGroup>
          </FormItem>
          <FormItem
            shouldUpdate={(prev, next) => prev.type !== next.type}
            noStyle
          >
            {(value: OpenPageFormType) =>
              value.type === "page" ? (
                <>
                  <FormItem
                    field="url"
                    label="选择页面"
                    rules={[{ required: true, message: "请选择页面" }]}
                  >
                    <Select
                      allowClear
                      placeholder="选择页面"
                      style={{ width: 350 }}
                    />
                  </FormItem>
                </>
              ) : value.type === "link" ? (
                <>
                  <FormItem
                    field="url"
                    label="输入链接"
                    rules={[
                      {
                        required: true,
                        message: "请输入链接",
                      },
                      {
                        match:
                          /^https?:\/\/([^!@#$%^&*?.\s-]([^!@#$%^&*?.\s]{0,63}[^!@#$%^&*?.\s])?\.)+[a-z]{2,6}\/?/,
                        message: "请输入正确的链接",
                      },
                    ]}
                  >
                    <Input
                      allowClear
                      placeholder="输入链接"
                      style={{ width: 350 }}
                    />
                  </FormItem>
                  <FormItem
                    field="blank"
                    label="新窗口打开"
                    triggerPropName="checked"
                  >
                    <Switch />
                  </FormItem>
                </>
              ) : null
            }
          </FormItem>
          <FormItem
            shouldUpdate={(prev, next) => prev.type !== next.type}
            noStyle
          >
            {(value: OpenPageFormType) =>
              value.type && (
                <FormItem field="params" label="参数">
                  <UrlParamsInput />
                </FormItem>
              )
            }
          </FormItem>
        </Form>
      </EventContentWarp>
    );
  }
);

export default {
  name: MENUKEYS.OPEN_PAGE,
  Form: OpenPageForm,
};
