import ActionWarp from "@/components/Editor/Menu/components/ActionWarp";
import StyleForm from "@/components/Editor/Menu/components/StyleForm";
import { produce } from "@/utils";
import { Divider } from "@arco-design/web-react";
import { pick } from "lodash";
import { ActionProps } from "../..";
import PropForm from "./PropForm";

const name = "divider";

const defaultSchema = {
  name,
  title: "分割线",
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
  componentMap: { [name]: Divider },
  icon: (props) => (
    <i
      className="arco-icon arco-icon-select-all i-ic:baseline-safety-divider"
      {...props}
    />
  ),
  desc: "划分内容区域，对模块做分隔。",
  defaultSchema,
  Action,
};
