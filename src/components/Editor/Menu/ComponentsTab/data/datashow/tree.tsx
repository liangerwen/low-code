import { Tree } from "@arco-design/web-react";

const name = "tree";

const defaultSchema = {
  name,
  title: "树",
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
  name,
  componentMap: { [name]: Tree },
  icon: (props) => (
    <i
      className="arco-icon arco-icon-select-all i-material-symbols:account-tree-outline-rounded"
      {...props}
    />
  ),
  desc: "对于文件夹、分类目录、组织架构等层级较多的内容，树可以清楚显示他们的层级关系，并具有展开、收起、选择等交互功能。",
  defaultSchema,
};
