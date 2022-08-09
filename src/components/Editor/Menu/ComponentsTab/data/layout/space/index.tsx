import ActionWarp from "@/components/Editor/Menu/components/ActionWarp";
import { Space } from "@arco-design/web-react";
import PropForm from "./PropForm";

const name = "space";

const defaultSchema = {
  name,
  title: "间距",
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
  componentMap: { [name]: Space },
  icon: () => (
    <i className="arco-icon arco-icon-select-all i-lucide:align-horizontal-space-around" />
  ),
  demo: [defaultSchema],
  defaultSchema,
  Action,
};
