const component = {
  name: "a-button",
  props: {
    type: "primary",
  },
  children: ["按钮"],
  inline: true,
};

export default {
  icon: "icon-check-circle-fill",
  text: "按钮",
  demo: {
    title: "按钮",
    components: [component],
  },
  component,
};
