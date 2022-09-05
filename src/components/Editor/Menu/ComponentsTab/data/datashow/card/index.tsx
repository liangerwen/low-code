import ActionWarp from "@/components/Editor/Menu/components/ActionWarp";
import StyleForm from "@/components/Editor/Menu/components/StyleForm";
import { produce } from "immer";
import { Card } from "@arco-design/web-react";
import { pick } from "lodash";
import { ActionProps } from "../..";
import PropForm from "./PropForm";

const name = "card";

const defaultSchema = {
  name,
  title: "卡片",
  props: {
    title: "卡片标题",
  },
  children: [],
  container: "inner",
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
      ]}
    />
  );
};

export default {
  name,
  componentMap: { [name]: Card },
  icon: (props) => (
    <i
      className="arco-icon arco-icon-select-all i-ic:round-credit-card"
      {...props}
    />
  ),
  desc: "将信息分类后分标题、详情等区域聚合展现，一般作为简洁介绍或者信息的大盘和入口。",
  defaultSchema,
  Action,
};
