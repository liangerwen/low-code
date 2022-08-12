import StyleForm from "@/components/Editor/Menu/components/StyleForm";
import {
  generateEventProps,
  getEventsFromProps,
} from "@/components/Editor/utils/events";
import { produce } from "@/utils";
import { Button } from "@arco-design/web-react";
import { pick } from "lodash";
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

const Action = (props: {
  schema: IComponent;
  onChange: (schema: IComponent) => void;
}) => {
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
        {
          title: "事件",
          key: 2,
          Form: EventForm,
          props: {
            options: [
              { label: "点击", value: "onClick" },
              // { label: "鼠标移入", value: "onMouseEnter" },
              // { label: "鼠标移出", value: "onMouseLeave" },
            ],
            value: getEventsFromProps(props.schema.props),
            onChange: (val) => {
              props.onChange(
                produce(props.schema, (schema) => {
                  schema.props = generateEventProps(schema.props, val);
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
  icon: () => (
    <i className="arco-icon arco-icon-select-all i-teenyicons:button-outline" />
  ),
  demo: [defaultSchema],
  defaultSchema,
  Action,
};
