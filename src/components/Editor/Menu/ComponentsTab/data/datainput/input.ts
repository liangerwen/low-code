import { Input } from "@arco-design/web-react";
import { IconCheckCircleFill } from "@arco-design/web-react/icon";

const name = "input";

const defaultSchema = {
  name,
  title: "输入框",
  attrs: {
    placeholder: "Please enter something",
    allowClear: true,
  },
  inline: true,
};

export default {
  name,
  componentMap: { [name]: Input },
  icon: IconCheckCircleFill,
  demo: [defaultSchema],
  defaultSchema,
};
