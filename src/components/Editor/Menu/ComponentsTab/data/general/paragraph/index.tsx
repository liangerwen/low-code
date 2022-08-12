import ActionWarp from "@/components/Editor/Menu/components/ActionWarp";
import EventForm from "@/components/Editor/Menu/components/EventForm";
import StyleForm from "@/components/Editor/Menu/components/StyleForm";
import {
  generateEventProps,
  getEventsFromProps,
} from "@/components/Editor/utils/events";
import { produce } from "@/utils";
import { Typography } from "@arco-design/web-react";
import { pick } from "lodash";
import { useMemo } from "react";
import PropForm from "./PropForm";

const { Paragraph } = Typography;

const name = "paragraph";

const defaultSchema = {
  name,
  title: "段落",
  children: ["这是一个段落"],
};

const Action = (props: {
  schema: IComponent;
  onChange: (schema: IComponent) => void;
}) => {
  const defaultOptions = useMemo(
    () => [
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
          value: pick(props.schema.props, "style", "className"),
          onChange: (val) => {
            props.onChange(
              produce(props.schema, (schema) => {
                schema.props = { ...schema.props, ...val };
              })
            );
          },
        },
      },
    ],
    []
  );
  const options = useMemo(() => {
    if (props.schema?.props?.editable) {
      return [
        ...defaultOptions,
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
    return defaultOptions;
  }, [props.schema]);
  return <ActionWarp options={options} />;
};

export default {
  name,
  componentMap: { [name]: Paragraph },
  icon: () => (
    <i className="arco-icon arco-icon-select-all i-teenyicons:paragraph-solid" />
  ),
  demo: [defaultSchema],
  defaultSchema,
  Action,
};
