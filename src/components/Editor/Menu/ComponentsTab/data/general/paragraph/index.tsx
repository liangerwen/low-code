import ActionWarp from "@/components/Editor/Menu/components/ActionWarp";
import { Typography } from "@arco-design/web-react";
import { IconCheckCircleFill } from "@arco-design/web-react/icon";
import PropForm from "./PropForm";

const { Title } = Typography;

const name = "paragraph";

const defaultSchema = {
  name,
  title: "段落",
  children: ["这是一个段落"],
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
  componentMap: { [name]: Title },
  icon: IconCheckCircleFill,
  demo: [defaultSchema],
  defaultSchema,
  Action,
};
