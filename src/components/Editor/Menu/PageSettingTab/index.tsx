import { Form, Switch } from "@arco-design/web-react";
import { pick } from "lodash";
import EventForm from "../components/EventForm";

const FormItem = Form.Item;
const useForm = Form.useForm;

interface FormProps {
  inMenu: boolean;
  lifecycle: {
    onLoad?: IEvent[];
    onDestroy?: IEvent[];
    onUpdate?: IEvent[];
  };
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
        inMenu: props.schema.inMenu,
        lifecycle: pick(props.schema, "onLoad", "onDestroy", "onUpdate"),
      }}
      onChange={(_, form) => {
        props.onChange({
          ...props.schema,
          ...form.lifecycle,
          inMenu: !!form.inMenu,
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
      <FormItem label="是否在菜单中" field="inMenu" triggerPropName="checked">
        <Switch />
      </FormItem>
    </Form>
  );
};
