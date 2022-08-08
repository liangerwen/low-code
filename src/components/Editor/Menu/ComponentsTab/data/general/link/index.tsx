import ActionWarp from "@/components/Editor/Menu/components/ActionWarp";
import { Link } from "@arco-design/web-react";
import { IconCheckCircleFill } from "@arco-design/web-react/icon";
import PropForm from "./PropForm";

const name = "link";

const defaultSchema = {
  name,
  title: "链接",
  props: {
    href: "https://www.baidu.com",
    icon: "222",
    target: "__blank",
  },
  children: ["链接"],
  inline: true,
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
  componentMap: { [name]: Link },
  icon: IconCheckCircleFill,
  demo: [defaultSchema],
  defaultSchema,
  Action,
};
