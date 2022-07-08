import { Button, Tabs } from "@arco-design/web-react";
import { IconCheckCircleFill } from "@arco-design/web-react/icon";
import PropForm from "./PropForm";

const name = "a-button";

const defaultSchema = {
  name,
  title: "按钮",
  props: {
    type: "primary",
  },
  children: ["按钮"],
  inline: true,
};

const action = (props: {
  schema: IComponent;
  onChange: (schema: IComponent) => void;
}) => {

  return (
    <Tabs justify>
      <Tabs.TabPane title="属性" key="1" className="px-4 overflow-auto">
        <PropForm {...props} />
      </Tabs.TabPane>
      <Tabs.TabPane title="事件" key="2"></Tabs.TabPane>
    </Tabs>
  );
};

export default {
  name,
  componentMap: { [name]: Button },
  icon: IconCheckCircleFill,
  demo: [defaultSchema],
  defaultSchema,
  action,
};
