import { Tree } from "@arco-design/web-react";

const component = {
  name: "a-tree",
  type: Tree,
  props: {
    treeData: [
      {
        title: "Trunk 0-0",
        key: "0-0",
        children: [
          {
            title: "Branch 0-0-0",
            key: "0-0-0",
            disabled: true,
            children: [
              {
                title: "Leaf",
                key: "0-0-0-0",
              },
              {
                title: "Leaf",
                key: "0-0-0-1",
              },
            ],
          },
          {
            title: "Branch 0-0-1",
            key: "0-0-1",
            children: [
              {
                title: "Leaf",
                key: "0-0-1-0",
              },
            ],
          },
        ],
      },
    ],
    defaultExpandedKeys: ["0-0-0"],
    defaultSelectedKeys: ["0-0-0", "0-0-1"],
  },
};

export default {
  icon: "icon-check-circle-fill",
  text: "树",
  demo: {
    title: "树",
    components: [component],
  },
  component,
};
