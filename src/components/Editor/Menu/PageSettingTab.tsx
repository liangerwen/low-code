import { Form, Switch } from "@arco-design/web-react";
import { pick } from "lodash";
import { useGlobalSetting } from "../GlobalSettingsProvider";
import EventForm from "./components/EventForm";

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

export default () => {
  const [form] = useForm<FormProps>();
  const { globalSetting, setGlobalSetting } = useGlobalSetting();

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={{
        inMenu: globalSetting.pageSetting.inMenu,
        lifecycle: pick(
          globalSetting.pageSetting,
          "onLoad",
          "onDestroy",
          "onUpdate"
        ),
      }}
      onChange={(_, form) => {
        setGlobalSetting({
          ...globalSetting,
          pageSetting: { ...form.lifecycle, inMenu: !!form.inMenu },
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
