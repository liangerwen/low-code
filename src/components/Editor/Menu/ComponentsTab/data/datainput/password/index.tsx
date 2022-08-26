import ActionWarp from "@/components/Editor/Menu/components/ActionWarp";
import EventForm from "@/components/Editor/Menu/components/EventForm";
import StyleForm from "@/components/Editor/Menu/components/StyleForm";
import {
  getEventsFromProps,
  generateEventProps,
} from "@/components/Editor/utils/events";
import { produce } from "@/utils";
import { Input } from "@arco-design/web-react";
import { pick } from "lodash";
import { ActionProps } from "../..";
import PropForm from "./PropForm";

const name = "password";

const defaultSchema = {
  name,
  title: "密码框",
  props: {
    placeholder: "请输入内容",
    allowClear: true,
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
            options: [
              { label: "改变", value: "onChange" },
              { label: "清除", value: "onClear" },
              { label: "回车", value: "onPressEnter" },
              { label: "显示状态改变", value: "onVisibilityChange" },
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
  componentMap: { [name]: Input.Password },
  icon: (props) => (
    <i
      className="arco-icon arco-icon-select-all i-material-symbols:password"
      {...props}
    />
  ),
  desc: "用于输入密码信息。",
  defaultSchema,
  Action,
};
