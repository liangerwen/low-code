const component = {
  name: "a-input",
  props: {
    placeholder: "Please enter something",
    allowClear: true,
  },
  inline: true,
};

export default {
  icon: "icon-check-circle-fill",
  text: "输入框",
  demo: {
    title: "输入框",
    components: [component],
  },
  component,
};
