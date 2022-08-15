import { Input } from "@arco-design/web-react";

const name = "input";

const defaultSchema = {
  name,
  title: "输入框",
  props: {
    placeholder: "请输入内容",
    allowClear: true,
  },
};

export default {
  name,
  componentMap: { [name]: Input },
  icon: (props) => (
    <i
      className="arco-icon arco-icon-select-all i-iconoir:input-field"
      {...props}
    />
  ),
  demo: [defaultSchema],
  defaultSchema,
};
