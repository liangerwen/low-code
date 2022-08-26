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
  desc: "将信息分类后分标题、详情等区域聚合展现，一般作为简洁介绍或者信息的大盘和入口。",
  defaultSchema,
};
