import { List } from "@arco-design/web-react";
import { IconCheckCircleFill } from "@arco-design/web-react/icon";

const name = "list";

const defaultSchema = {
  name,
  title: "列表",
  props: {
    type: "primary",
  },
  children: [
    {
      name: "list-item",
      children: ["item1"],
    },
    {
      name: "list-item",
      children: ["item2"],
    },
    {
      name: "list-item",
      children: ["item3"],
    },
  ],
};

export default {
  name,
  componentMap: { [name]: List, "list-item": List.Item },
  icon: IconCheckCircleFill,
  demo: [defaultSchema],
  defaultSchema,
};
