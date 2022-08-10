import { Card } from "@arco-design/web-react";
import { IconList } from "@arco-design/web-react/icon";

const name = "card";

const defaultSchema = {
  name,
  title: "卡片",
  props: {
    title: "卡片标题",
  },
  children: [],
  container: true,
};

export default {
  name,
  componentMap: { [name]: Card },
  icon: IconList,
  demo: [defaultSchema],
  defaultSchema,
};
