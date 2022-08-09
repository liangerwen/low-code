import ActionWarp from "@/components/Editor/Menu/components/ActionWarp";
import { Divider } from "@arco-design/web-react";
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
