import { Collapse, Form, InputTag } from "@arco-design/web-react";
import { CSSProperties, useEffect } from "react";
import BackgroundForm from "./BackgroundForm";
import BorderForm from "./BorderForm";
import FontForm from "./FontForm";
import LayoutForm from "./LayoutForm";
import PositionForm from "./PositionForm";

const { Item: FormItem, useForm } = Form;
const CollapseItem = Collapse.Item;

type StyleFormType = {
  className: string;
  style: CSSProperties;
};

export default function StyleForm(props) {
  const { value, onChange } = props;
  const [form] = useForm<StyleFormType>();

  useEffect(() => {
    const { style = {}, className } = value;
    form.setFieldsValue({ className, style });
  }, [value]);

  return (
    <Form
      form={form}
      onChange={(_, form) => onChange(form)}
      layout="vertical"
      labelCol={{ span: 0 }}
      wrapperCol={{ span: 24 }}
    >
      <FormItem
        label="类名绑定"
        field="className"
        normalize={(v) => v && v.join(" ")}
        formatter={(v) => v && v.split(" ")}
      >
        <InputTag placeholder="输入类名" />
      </FormItem>
      <FormItem label="行内样式">
        <Collapse
          defaultActiveKey={[
            "layout",
            "font",
            "background",
            "position",
            "border",
          ]}
        >
          <CollapseItem name="layout" header="布局">
            <FormItem field="style">
              <LayoutForm />
            </FormItem>
          </CollapseItem>
          <CollapseItem name="font" header="文字">
            <FormItem field="style">
              <FontForm />
            </FormItem>
          </CollapseItem>
          <CollapseItem name="background" header="背景">
            <FormItem field="style">
              <BackgroundForm />
            </FormItem>
          </CollapseItem>
          <CollapseItem name="position" header="定位">
            <FormItem field="style">
              <PositionForm />
            </FormItem>
          </CollapseItem>
          <CollapseItem name="border" header="边框">
            <FormItem field="style">
              <BorderForm />
            </FormItem>
          </CollapseItem>
        </Collapse>
      </FormItem>
    </Form>
  );
}
