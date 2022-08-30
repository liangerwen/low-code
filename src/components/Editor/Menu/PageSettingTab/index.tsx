import { Form } from "@arco-design/web-react";
import { pick } from "lodash";
import { generateEventProps } from "../../utils/events";
import EventForm from "../components/EventForm";
import GlobalCssEditor from "./GlobalCssEditor";
import GlobalDataEditor from "./GlobalDataEditor";

const FormItem = Form.Item;
const useForm = Form.useForm;

interface FormProps {
  lifecycle: {
    onLoad?: EventType;
    onDestroy?: EventType;
    onUpdate?: EventType;
  };
  data: Record<string, any>;
  css: string;
}

interface IProps {
  schema: ISchema;
  onChange: (schema: ISchema) => void;
}

export default (props: IProps) => {
  const [form] = useForm<FormProps>();

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={{
        lifecycle: pick(props.schema, "onLoad", "onDestroy", "onUpdate"),
        data: props.schema?.data,
        css: props.schema?.css,
      }}
      onChange={(_, form) => {
        props.onChange({
          ...generateEventProps(props.schema, form.lifecycle),
          data: form.data,
          css: form.css,
        });
      }}
    >
      <FormItem label="生命周期" field="lifecycle">
        <EventForm
          options={[
            { label: "页面加载", value: "onLoad" },
            { label: "页面销毁", value: "onDestroy" },
            { label: "页面更新", value: "onUpdate" },
          ]}
        />
      </FormItem>
      <FormItem
        label="全局变量"
        field="data"
        normalize={(data) => {
          if (data?.trim()) return JSON.parse(data);
          return data;
        }}
        formatter={(data) => JSON.stringify(data || {}, null, 4)}
      >
        <GlobalDataEditor />
      </FormItem>
      <FormItem label="全局样式" field="css">
        <GlobalCssEditor />
      </FormItem>
    </Form>
  );
};
