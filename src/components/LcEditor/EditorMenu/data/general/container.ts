import { Grid } from "@arco-design/web-react";

const { Row } = Grid;

const component = {
  name: "a-row",
  type: Row,
  container: true,
};

export default {
  icon: "icon-check-circle-fill",
  text: "容器",
  demo: {
    title: "容器",
    components: [component],
  },
  component,
};
