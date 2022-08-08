import ActionWarp from "@/components/Editor/Menu/components/ActionWarp";
import EventForm from "@/components/Editor/Menu/components/EventForm";
import {
  generateEventProps,
  getEventsFromProps,
} from "@/components/Editor/utils/events";
import { produce } from "@/utils";
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
    if (props.schema?.props?.editable) {
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
            value: getEventsFromProps(props.schema.props.editable),
            onChange: (val) => {
              props.onChange(
                produce(props.schema, (schema) => {
                  schema.props.editable = generateEventProps(
                    schema.props.editable,
                    val
                  );
                })
              );
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
