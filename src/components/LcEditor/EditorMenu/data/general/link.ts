import { Link } from "@arco-design/web-react";
import { IconCheckCircleFill } from "@arco-design/web-react/icon";

const name = "a-link";

const defaultSchema = {
  name,
  title: "链接",
  props: {
    href: "link",
    icon: "222",
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
