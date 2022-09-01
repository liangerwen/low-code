import ActionWarp from "@/components/Editor/Menu/components/ActionWarp";
import EventForm from "@/components/Editor/Menu/components/EventForm";
import StyleForm from "@/components/Editor/Menu/components/StyleForm";
import {
  getEventsFromProps,
  generateEventProps,
} from "@/components/Editor/utils/events";
import { produce } from "@/utils";
import { Checkbox } from "@arco-design/web-react";
import { IconCheckSquare } from "@arco-design/web-react/icon";
import { generate as uuid } from "shortid";
import { pick } from "lodash";
import { ActionProps } from "../..";
import PropForm from "./PropForm";

const name = "checkbox";

const defaultSchema = {
  name,
  title: "复选框",
  props: {
    options: [
      { label: "我是第一个", value: 1, id: uuid() },
      { label: "我是第二个", value: 2, id: uuid() },
    ],
  },
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
            options: [{ label: "改变", value: "onChange" }],
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

export default {
  name,
  componentMap: { [name]: Checkbox.Group },
  icon: IconCheckSquare,
  desc: "在一组数据中，用户可通过复选框选择一个或多个数据。",
  defaultSchema,
  Action,
};
