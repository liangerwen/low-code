import { forwardRef, useEffect, useImperativeHandle } from "react";
import EventContentWarp from "../EventContentWarp";
import MENUKEYS from "../../keys";
import { DownLoadFileFormType, FormPropsType, FormRefType } from "../../types";
import { Form, Input } from "@arco-design/web-react";

const { useForm, Item: FormItem } = Form;

const DownLoadFileForm = forwardRef<
  FormRefType,
  FormPropsType<DownLoadFileFormType>
>(function ({ value }, ref) {
  const [form] = useForm<DownLoadFileFormType>();

  useImperativeHandle(ref, () => ({
    validate: form.validate,
  }));

  useEffect(() => {
    form.resetFields();
    form.setFieldsValue(value);
  }, [value]);

  return (
    <EventContentWarp desc="下载文件">
      <Form form={form} layout="vertical">
        <FormItem
          field="url"
          label="下载地址"
          rules={[
            { required: true, message: "请输入下载地址" },
            {
              match:
                /^https?:\/\/([^!@#$%^&*?.\s-]([^!@#$%^&*?.\s]{0,63}[^!@#$%^&*?.\s])?\.)+[a-z]{2,6}\/?/,
              message: "请输入正确的下载地址",
            },
          ]}
        >
          <Input placeholder="输入下载地址" allowClear />
        </FormItem>
      </Form>
    </EventContentWarp>
  );
});

export default {
  name: MENUKEYS.DOWNLOAD_FILE,
  Form: DownLoadFileForm,
};
