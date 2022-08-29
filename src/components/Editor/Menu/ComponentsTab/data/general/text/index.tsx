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
import { ActionProps } from "../..";
import PropForm from "./PropForm";

const { Text } = Typography;

const name = "text";

const defaultSchema = {
  name,
  title: "文字",
  children: ["这是一段文字"],
  inline: true,
};

const Action = (props: ActionProps) => {
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
    ],
    [props]
  );
  const options = useMemo(() => {
    if (props.component?.props?.editable) {
      return [
        ...defaultOptions,
        {
          title: "事件",
          key: 3,
          Form: EventForm,
          props: {
            options: [{ label: "编辑", value: "onChange" }],
            value: getEventsFromProps(props.component.props.editable),
            onChange: (val) => {
              props.onChange(
                produce(props.component, (component) => {
                  component.props.editable = generateEventProps(
                    component.props.editable,
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
  }, [props.component, defaultOptions]);
  return <ActionWarp options={options} />;
};

export default {
  name,
  componentMap: { [name]: Text },
  icon: (props) => (
    <i
      className="arco-icon arco-icon-select-all i-material-symbols:format-color-text"
      {...props}
    />
  ),
  desc: "用表义符号记录表达信息以传之久远的方式和工具。",
  defaultSchema,
  Action,
};
