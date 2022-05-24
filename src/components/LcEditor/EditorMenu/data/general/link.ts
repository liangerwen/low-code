import { Link } from "@arco-design/web-react";

const component = {
  name: "a-link",
  type: Link,
  props: {
    href: "link",
    icon: "222",
  },
  children: ["链接"],
  inline: true,
};

export default {
  icon: "icon-check-circle-fill",
  text: "链接",
  demo: {
    title: "链接",
    components: [component],
  },
  component,
};
