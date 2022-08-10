import ActionWarp from "@/components/Editor/Menu/components/ActionWarp";
import { Grid } from "@arco-design/web-react";
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
      ]}
    />
  );
};

export default {
  name,
  componentMap: { [name]: Col },
  icon: () => (
    <i className="arco-icon arco-icon-select-all i-mdi:land-rows-vertical" />
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
