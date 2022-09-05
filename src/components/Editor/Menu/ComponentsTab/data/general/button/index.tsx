import StyleForm from "@/components/Editor/Menu/components/StyleForm";
import {
  generateEventProps,
  getEventsFromProps,
} from "@/components/Editor/utils/events";
import { produce } from "immer";
import { Button } from "@arco-design/web-react";
import { pick } from "lodash";
import { ActionProps } from "../..";
import ActionWarp from "../../../../components/ActionWarp";
import EventForm from "../../../../components/EventForm";
import PropForm from "./PropForm";

const name = "button";

const defaultSchema = {
  name,
  title: "按钮",
  props: {
    type: "primary",
  },
  children: ["按钮"],
  inline: true,
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
              { label: "点击", value: "onClick" },
              // { label: "鼠标移入", value: "onMouseEnter" },
              // { label: "鼠标移出", value: "onMouseLeave" },
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

export default {
  name,
  componentMap: { [name]: Button },
  icon: (props) => (
    <i
      className="arco-icon arco-icon-select-all i-teenyicons:button-outline"
      {...props}
    />
  ),
  desc: "按钮是一种命令组件，可发起一个即时操作。",
  defaultSchema,
  Action,
};
