import ActionWarp from "@/components/Editor/Menu/components/ActionWarp";
import StyleForm from "@/components/Editor/Menu/components/StyleForm";
import { produce } from "immer";
import { Form } from "@arco-design/web-react";
import { pick } from "lodash";
import { ActionProps } from "../..";
import PropForm from "./PropForm";

const name = "formitem";

const defaultSchema = {
  name,
  title: "表单项",
  container: "outside",
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
  componentMap: { [name]: Form.Item },
  icon: (props) => (
    <i
      className="arco-icon arco-icon-select-all i-icon-park-twotone:add-item"
      {...props}
    />
  ),
  desc: "表单中复选框、单选框、输入框、下拉选择框等元素的容器，用于收集数据给表单。",
  defaultSchema,
  Action,
};
