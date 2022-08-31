import ActionWarp from "@/components/Editor/Menu/components/ActionWarp";
import EventForm from "@/components/Editor/Menu/components/EventForm";
import { FormProviderContext } from "@/components/Editor/Menu/components/ProFormProvider";
import StyleForm from "@/components/Editor/Menu/components/StyleForm";
import {
  generateEventProps,
  getEventsFromProps,
} from "@/components/Editor/utils/events";
import { produce } from "@/utils";
import {
  Form as ArcoForm,
  FormInstance,
  FormProps,
} from "@arco-design/web-react";
import { pick } from "lodash";
import { forwardRef, useContext, useEffect, useImperativeHandle } from "react";
import { generate as uuid } from "shortid";
import { ActionProps } from "../..";
import PropForm from "./PropForm";

const name = "form";

const defaultSchema = {
  name,
  title: "表单",
  props: {
    id: uuid(),
    onSubmit: {
      isEvent: true,
      actions: [
        {
          id: uuid(),
          name: "custom",
          form: {
            content:
              "console.log(page.forms[current.schema.props?.id]?.getFieldsValue())",
          },
        },
      ],
    },
  },
  container: true,
};

const Action = (props: ActionProps) => {
  return (
    <ActionWarp
      options={[
        {
          title: "属性",
          key: 1,
          Form: PropForm,
          props,
        },
        {
          title: "样式",
          key: 2,
          Form: StyleForm,
          props: {
            value: pick(props.component.props, "style", "className"),
            onChange: (val) => {
              props.onChange(
                produce(props.component, (component) => {
                  component.props = { ...component.props, ...val };
                })
              );
            },
          },
        },
        {
          title: "事件",
          key: 3,
          Form: EventForm,
          props: {
            options: [
              { label: "提交", value: "onSubmit" },
              { label: "重置", value: "onReset" },
              { label: "改变", value: "onChange" },
            ],
            value: getEventsFromProps(props.component.props),
            onChange: (val) => {
              props.onChange(
                produce(props.component, (component) => {
                  component.props = generateEventProps(component.props, val);
                })
              );
            },
          },
        },
      ]}
    />
  );
};

const Form = forwardRef<FormInstance, FormProps>((props, ref) => {
  const [form] = ArcoForm.useForm();
  const { collect } = useContext(FormProviderContext);

  useImperativeHandle(ref, () => form);

  useEffect(() => {
    const dispose = props?.id && collect(props.id, form);
    return dispose;
  }, []);

  return <ArcoForm {...props} form={form} />;
});

export default {
  name,
  componentMap: { [name]: Form },
  icon: (props) => (
    <i
      className="arco-icon arco-icon-select-all i-material-symbols:dynamic-form-outline"
      {...props}
    />
  ),
  desc: "具有数据收集、校验和提交功能的表单，包含复选框、单选框、输入框、下拉选择框等元素。",
  defaultSchema,
  Action,
};
