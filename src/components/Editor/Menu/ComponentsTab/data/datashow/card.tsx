import { Card } from "@arco-design/web-react";

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
  icon: (props) => (
    <i
      className="arco-icon arco-icon-select-all i-ic:round-credit-card"
      {...props}
    />
  ),
  demo: [defaultSchema],
  defaultSchema,
};
