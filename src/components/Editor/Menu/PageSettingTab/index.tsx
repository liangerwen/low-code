import { Form, Switch } from "@arco-design/web-react";
import { pick } from "lodash";
import { generateEventProps } from "../../utils/events";
import EventForm from "../components/EventForm";
import JsonInput from "../components/JsonInput";

const FormItem = Form.Item;
const useForm = Form.useForm;

interface FormProps {
  lifecycle: {
    onLoad?: EventType;
    onDestroy?: EventType;
    onUpdate?: EventType;
  };
  data: Record<string, any>;
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
      }}
      onChange={(_, form) => {
        props.onChange({
          ...generateEventProps(props.schema, form.lifecycle),
          data: form.data,
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
        <JsonInput />
      </FormItem>
    </Form>
  );
};
