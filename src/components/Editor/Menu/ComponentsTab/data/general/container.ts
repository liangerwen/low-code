import { Grid } from "@arco-design/web-react";
import { IconCheckCircleFill } from "@arco-design/web-react/icon";

const { Row } = Grid;

const name = "a-row";

const defaultSchema = {
  name,
  title: "容器",
  container: true,
};

export default {
  name,
  componentMap: { [name]: Row },
  icon: IconCheckCircleFill,
  demo: [defaultSchema],
  defaultSchema,
};
