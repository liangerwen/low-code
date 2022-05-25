const component = {
  name: "a-list",
  props: {
    type: "primary",
  },
  children: [
    {
      name: "a-list-item",
      children: ["item1"],
    },
    {
      name: "a-list-item",
      children: ["item2"],
    },
    {
      name: "a-list-item",
      children: ["item3"],
    },
  ],
};

export default {
  icon: "icon-check-circle-fill",
  text: "列表",
  demo: {
    title: "列表",
    components: [component],
  },
  component,
};
