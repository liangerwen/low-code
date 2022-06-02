import { List } from "@arco-design/web-react";
import { IconCheckCircleFill } from "@arco-design/web-react/icon";

const name = "a-list";

const defaultSchema = {
  name,
  title: "列表",
  props: {
    type: "primary",
  },
  children: [
    {
      name: "a-list-item",
      children: ["item1"],
    },
    {
      name: "a-list-item",
      children: ["item2"],
    },
    {
      name: "a-list-item",
      children: ["item3"],
    },
  ],
};

export default {
  name,
  componentMap: { [name]: List, "a-list-item": List.Item },
  icon: IconCheckCircleFill,
  demo: [defaultSchema],
  defaultSchema,
};
