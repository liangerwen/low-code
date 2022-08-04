import { Link } from "@arco-design/web-react";
import { IconCheckCircleFill } from "@arco-design/web-react/icon";

const name = "a-link";

const defaultSchema = {
  name,
  title: "链接",
  attrs: {
    href: "https://www.baidu.com",
    icon: "222",
    target: "__blank",
  },
  children: ["链接"],
  inline: true,
};

export default {
  name,
  componentMap: { [name]: Link },
  icon: IconCheckCircleFill,
  demo: [defaultSchema],
  defaultSchema,
};
