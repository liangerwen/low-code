import ActionWarp from "@/components/Editor/Menu/components/ActionWarp";
import StyleForm from "@/components/Editor/Menu/components/StyleForm";
import { produce } from "@/utils";
import { Grid } from "@arco-design/web-react";
import { pick } from "lodash";
import PropForm from "./PropForm";

const { Col } = Grid;

const name = "col";

const defaultSchema = {
  name,
  title: "列",
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
  componentMap: { [name]: Col },
  icon: (props) => (
    <i
      className="arco-icon arco-icon-select-all i-mdi:land-rows-vertical"
      {...props}
    />
  ),
  demo: [
    {
      name,
      title: "列",
      container: true,
      props: {
        className: "py-10 border border-dashed border-[rgb(var(--gray-4))]",
      },
    },
  ],
  defaultSchema,
  Action,
};
