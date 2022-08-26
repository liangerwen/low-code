import { List } from "@arco-design/web-react";
import { IconList } from "@arco-design/web-react/icon";

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
  icon: IconList,
  desc: "最基础的列表展示，可承载文字、列表、图片、段落，常用于后台数据展示页面。",
  defaultSchema,
};
