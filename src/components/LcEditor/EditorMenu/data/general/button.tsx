import { Button, Tabs } from "@arco-design/web-react";
import { IconCheckCircleFill } from "@arco-design/web-react/icon";
import { useState } from "react";

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

const action = (props: { schema: IComponent }) => {
  const [color, setColor] = useState("rgb(22,93,255)");
  return (
    <Tabs>
      <Tabs.TabPane title="属性" key="1"></Tabs.TabPane>
      <Tabs.TabPane title="样式" key="2"></Tabs.TabPane>
      <Tabs.TabPane title="数据源" key="3"></Tabs.TabPane>
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
