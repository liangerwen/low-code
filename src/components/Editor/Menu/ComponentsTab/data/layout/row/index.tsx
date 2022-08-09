import ActionWarp from "@/components/Editor/Menu/components/ActionWarp";
import { Grid } from "@arco-design/web-react";
import PropForm from "./PropForm";

const { Row } = Grid;

const name = "row";

const defaultSchema = {
  name,
  title: "行",
  container: true,
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
  componentMap: { [name]: Row },
  icon: () => (
    <i className="arco-icon arco-icon-select-all i-mdi:land-rows-horizontal" />
  ),
  demo: [
    {
      name,
      title: "行",
      container: true,
      props: {
        className: "py-10 border border-dashed border-[rgb(var(--gray-4))]",
      },
    },
  ],
  defaultSchema,
  Action,
};
