import { Tree } from "@arco-design/web-react";
import { IconCheckCircleFill } from "@arco-design/web-react/icon";

const name = "a-tree";

const defaultSchema = {
  name,
  title: "树",
  attrs: {
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
  name,
  componentMap: { [name]: Tree },
  icon: IconCheckCircleFill,
  demo: [defaultSchema],
  defaultSchema,
};
