import ActionWarp from "@/components/Editor/Menu/components/ActionWarp";
import EventForm from "@/components/Editor/Menu/components/EventForm";
import {
  generateEventProps,
  getEventsFromProps,
} from "@/components/Editor/utils/events";
import { produce } from "@/utils";
import { Typography } from "@arco-design/web-react";
import { IconH1 } from "@arco-design/web-react/icon";
import { useMemo } from "react";
import PropForm from "./PropForm";

const { Title } = Typography;

const name = "title";

const defaultSchema = {
  name,
  title: "标题",
  children: ["这是一个标题"],
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
  componentMap: { [name]: Title },
  icon: IconH1,
  demo: [defaultSchema],
  defaultSchema,
  Action,
};
