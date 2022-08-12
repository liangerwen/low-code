import ActionWarp from "@/components/Editor/Menu/components/ActionWarp";
import StyleForm from "@/components/Editor/Menu/components/StyleForm";
import { produce } from "@/utils";
import { Divider } from "@arco-design/web-react";
import { pick } from "lodash";
import PropForm from "./PropForm";

const name = "divider";

const defaultSchema = {
  name,
  title: "分割线",
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
      ]}
    />
  );
};

export default {
  name,
  componentMap: { [name]: Divider },
  icon: () => (
    <i className="arco-icon arco-icon-select-all i-ic:baseline-safety-divider" />
  ),
  demo: [defaultSchema],
  defaultSchema,
  Action,
};
