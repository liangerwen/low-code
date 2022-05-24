import {
  IconCheckCircleFill,
  IconPlusCircleFill,
  IconQuestionCircleFill,
} from "@arco-design/web-react/icon";

const component = {
  name: "icon-close-circle-fill",
  type: IconCheckCircleFill,
  props: {
    style: { fontSize: 24 },
  },
  inline: true,
};

export default {
  icon: "icon-check-circle-fill",
  text: "图标",
  demo: {
    title: "图标",
    components: [
      component,
      {
        name: "icon-question-circle-fill",
        type: IconQuestionCircleFill,
        props: {
          style: { fontSize: 24 },
        },
      },
      {
        name: "icon-plus-circle-fill",
        type: IconPlusCircleFill,
        props: {
          style: { fontSize: 24 },
        },
      },
      {
        name: "icon-check-circle-fill",
        type: IconCheckCircleFill,
        props: {
          style: { fontSize: 24 },
        },
      },
    ],
  },
  component,
};
