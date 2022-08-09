import ActionWarp from "@/components/Editor/Menu/components/ActionWarp";
import { Link } from "@arco-design/web-react";
import { IconLink } from "@arco-design/web-react/icon";
import PropForm from "./PropForm";

const name = "link";

const defaultSchema = {
  name,
  title: "链接",
  props: {
    href: "https://www.baidu.com",
    icon: {
      isIcon: true,
      name: "IconLink",
    },
    target: "_blank",
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
  icon: IconLink,
  demo: [defaultSchema],
  defaultSchema,
  Action,
};
