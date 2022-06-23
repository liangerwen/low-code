import {
  IconCheckCircleFill,
  IconCloseCircleFill,
} from "@arco-design/web-react/icon";

const name = "icon-close-circle-fill";

const defaultSchema = {
  name,
  title: "图标",
  props: {
    style: { fontSize: 24 },
  },
  inline: true,
};

export default {
  name,
  componentMap: { [name]: IconCloseCircleFill },
  icon: IconCheckCircleFill,
  demo: [
    defaultSchema,
    // {
    //   name: "icon-question-circle-fill",
    //   props: {
    //     style: { fontSize: 24 },
    //   },
    // },
    // {
    //   name: "icon-plus-circle-fill",
    //   props: {
    //     style: { fontSize: 24 },
    //   },
    // },
    // {
    //   name: "icon-check-circle-fill",
    //   props: {
    //     style: { fontSize: 24 },
    //   },
    // },
  ],
  defaultSchema,
};
