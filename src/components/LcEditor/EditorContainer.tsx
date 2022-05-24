import { Button, Grid, Layout, Space, Tooltip } from "@arco-design/web-react";
import {
  IconClose,
  IconCopy,
  IconDelete,
  IconPaste,
  IconRedo,
  IconUndo,
} from "@arco-design/web-react/icon";
import styles from "./styles/editor-container.module.less";

const Row = Grid.Row;

export default () => {
  const toolbar = [
    {
      content: "复制",
      icon: <IconCopy />,
      // onClick:onCopy,
    },
    {
      content: "粘贴",
      icon: <IconPaste />,
      // onClick:onCopy,
    },
    {
      content: "撤销",
      icon: <IconUndo />,
      // onClick:onCopy,
    },
    {
      content: "重做",
      icon: <IconRedo />,
      // onClick:onCopy,
    },
    {
      content: "删除",
      icon: <IconDelete />,
      // onClick: onDelete,
    },
    {
      content: "清空",
      icon: <IconClose />,
      // onClick: onClear,
    },
  ];
  return (
    <Layout className="h-full">
      <Layout.Content className="flex flex-col">
        <Row className={styles["lc-content"]} justify="center">
          <Space className="flex">
            {toolbar.map((tb, idx) => (
              <Tooltip content={tb.content} color="#9FD4FD" key={idx}>
                <Button
                  type="text"
                  icon={tb.icon}
                  // onClick={tb.onClick}
                />
              </Tooltip>
            ))}
          </Space>
        </Row>
        <Row
          className={[
            styles["lc-content"],
            styles["lc-editor-container"],
            "p-2 h-full flex-1 content-start",
          ]}
        ></Row>
      </Layout.Content>
      <Layout.Sider
        className={[styles["lc-content"], "border-none ml-2 py-4 shadow-none"]}
        width={300}
      ></Layout.Sider>
    </Layout>
  );
};
