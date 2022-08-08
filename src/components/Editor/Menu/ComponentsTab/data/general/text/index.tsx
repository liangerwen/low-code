import ActionWarp from "@/components/Editor/Menu/components/ActionWarp";
import EventForm from "@/components/Editor/Menu/components/EventForm";
import { Typography } from "@arco-design/web-react";
import { IconCheckCircleFill } from "@arco-design/web-react/icon";
import { useMemo } from "react";
import PropForm from "./PropForm";

const { Text } = Typography;

const name = "text";

const defaultSchema = {
  name,
  title: "文字",
  children: ["这是一段文字"],
  inline: true,
};

const Action = (props: {
  schema: IComponent;
  onChange: (schema: IComponent) => void;
}) => {
  const options = useMemo(() => {
    if (props.schema?.attrs?.editable) {
      return [
        {
          title: "属性",
          key: 1,
          Form: PropForm,
          props,
        },
        {
          title: "事件",
          key: 2,
          Form: EventForm,
          props: {
            options: [{ label: "编辑", value: "onChange" }],
            value: props.schema.events,
            onChange: (val) => {
              props.onChange({ ...props.schema, events: val });
            },
          },
        },
      ];
    }
    return [
      {
        title: "属性",
        key: 1,
        Form: PropForm,
        props,
      },
    ];
  }, [props.schema]);
  return <ActionWarp options={options} />;
};

export default {
  name,
  componentMap: { [name]: Text },
  icon: IconCheckCircleFill,
  demo: [defaultSchema],
  defaultSchema,
  Action,
};
