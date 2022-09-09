import ActionWarp from "@/components/Editor/Menu/components/ActionWarp";
import EventForm from "@/components/Editor/Menu/components/EventForm";
import StyleForm from "@/components/Editor/Menu/components/StyleForm";
import {
  getEventsFromProps,
  generateEventProps,
} from "@/components/Editor/utils/events";
import { produce } from "immer";
import { InputTag } from "@arco-design/web-react";
import { pick } from "lodash";
import { ActionProps } from "../..";
import PropForm from "./PropForm";

const name = "input-tag";

const defaultSchema = {
  name,
  title: "标签输入",
  props: {
    placeholder: "请输入标签",
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
              { label: "聚焦", value: "onFocus" },
              { label: "失焦", value: "onBlur" },
              { label: "点击", value: "onClick" },
              { label: "改变", value: "onChange" },
              { label: "清除", value: "onClear" },
              { label: "回车", value: "onPressEnter" },
              { label: "移除标签", value: "onRemove" },
              { label: "键盘", value: "onKeyDown" },
              { label: "粘贴", value: "onPaste" },
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
  componentMap: { [name]: InputTag },
  icon: (props) => (
    <i
      className="arco-icon arco-icon-select-all i-iconoir:input-field"
      {...props}
    />
  ),
  desc: "用于输入标签。",
  defaultSchema,
  Action,
};
