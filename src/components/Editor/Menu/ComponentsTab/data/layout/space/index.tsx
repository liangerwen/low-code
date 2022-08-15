import ActionWarp from "@/components/Editor/Menu/components/ActionWarp";
import StyleForm from "@/components/Editor/Menu/components/StyleForm";
import { produce } from "@/utils";
import { Space } from "@arco-design/web-react";
import { pick } from "lodash";
import PropForm from "./PropForm";

const name = "space";

const defaultSchema = {
  name,
  title: "间距",
  container: true,
  onlyContainer: true,
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
  componentMap: { [name]: Space },
  icon: (props) => (
    <i
      className="arco-icon arco-icon-select-all i-lucide:align-horizontal-space-around"
      {...props}
    />
  ),
  demo: [defaultSchema],
  defaultSchema,
  Action,
};
