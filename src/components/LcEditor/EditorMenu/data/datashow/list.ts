import { List } from "@arco-design/web-react";

const component = {
  name: "a-list",
  type: List,
  props: {
    type: "primary",
  },
  children: [
    {
      name: "a-list-item",
      type: List.Item,
      children: ["item1"],
    },
    {
      name: "a-list-item",
      type: List.Item,
      children: ["item2"],
    },
    {
      name: "a-list-item",
      type: List.Item,
      children: ["item3"],
    },
  ],
};

export default {
  icon: "icon-check-circle-fill",
  text: "列表",
  demo: {
    title: "列表",
    components: [component],
  },
  component,
};
