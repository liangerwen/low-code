import ActionWarp from "@/components/Editor/Menu/components/ActionWarp";
import EventForm from "@/components/Editor/Menu/components/EventForm";
import StyleForm from "@/components/Editor/Menu/components/StyleForm";
import {
  generateEventProps,
  getEventsFromProps,
} from "@/components/Editor/utils/events";
import { produce } from "immer";
import { Typography } from "@arco-design/web-react";
import { IconH1 } from "@arco-design/web-react/icon";
import { pick } from "lodash";
import { useMemo } from "react";
import { ActionProps } from "../..";
import PropForm from "./PropForm";

const { Title } = Typography;

const name = "title";

const defaultSchema = {
  name,
  title: "标题",
  children: ["这是一个标题"],
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
  componentMap: { [name]: Title },
  icon: IconH1,
  desc: "标明文章、作品等内容的简短语句。",
  defaultSchema,
  Action,
};
