import ActionWarp from "@/components/Editor/Menu/components/ActionWarp";
import EventForm from "@/components/Editor/Menu/components/EventForm";
import StyleForm from "@/components/Editor/Menu/components/StyleForm";
import {
  getEventsFromProps,
  generateEventProps,
} from "@/components/Editor/utils/events";
import { produce } from "immer";
import { Select } from "@arco-design/web-react";
import { IconSelectAll } from "@arco-design/web-react/icon";
import { generate as uuid } from "shortid";
import { pick } from "lodash";
import { ActionProps } from "../..";
import PropForm from "./PropForm";

const name = "select";

const defaultSchema = {
  name,
  title: "选择框",
  props: {
    options: [
      { label: "我是第一个", value: 1, id: uuid() },
      { label: "我是第二个", value: 2, id: uuid() },
    ],
    placeholder: "请选择内容",
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
  componentMap: { [name]: Select },
  icon: IconSelectAll,
  desc: "当用户需要从一组同类数据中选择一个或多个时，可以使用下拉选择器，点击后选择对应项。",
  defaultSchema,
  Action,
};
