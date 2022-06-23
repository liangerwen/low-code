import {
  Button,
  Divider,
  Drawer,
  Grid,
  Layout,
  Space,
  Tooltip,
} from "@arco-design/web-react";
import {
  IconClose,
  IconCodeBlock,
  IconCopy,
  IconDelete,
  IconPaste,
  IconRedo,
  IconUndo,
} from "@arco-design/web-react/icon";
import ReactJson from "react-json-view";
import classNames from "classnames";
import { useCallback, useContext, useState } from "react";
import { useDroppable } from "@dnd-kit/core";
import { EditorContext } from ".";
import Item from "./Item";
import { filterComponent } from "./utils";
import styles from "./styles/editor-container.module.less";
import itemStyles from "./styles/item.module.less";
import { getRenderActionByName } from "./EditorMenu/data";

const { Row } = Grid;

interface IProps {
  schema: ISchema;
  onChange: (schema: ISchema) => void;
}

export const PAGE_FLAG = "page";

export default (props: IProps) => {
  const { activeComponent, setActiveComponent, position } =
    useContext(EditorContext);

  const onClear = () => {
    props.onChange([]);
  };
  const onDelete = () => {
    props.onChange(
      filterComponent(props.schema, (c) => c.id !== activeComponent?.id)
    );
    setActiveComponent(null);
  };

  const [visible, setVisible] = useState(false);

  const toolbar = [
    {
      content: "查看JSON",
      icon: <IconCodeBlock />,
      onClick: () => setVisible(true),
    },
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
      onClick: onDelete,
    },
    {
      content: "清空",
      icon: <IconClose />,
      onClick: onClear,
    },
  ];

  const { setNodeRef } = useDroppable({
    id: "page",
  });

  const renderAction = useCallback(() => {
    if (!activeComponent) return null;
    const ComponentAction = getRenderActionByName(activeComponent.name);
    if (!ComponentAction) return null;
    return (
      <div className="bg-white">
        <ComponentAction schema={activeComponent} />
      </div>
    );
  }, [activeComponent]);

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
                  onClick={() => tb?.onClick?.()}
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
          onClick={(e) => {
            e.stopPropagation();
            setActiveComponent(null);
          }}
          ref={setNodeRef}
        >
          {props.schema.map((component, idx) => (
            <Item key={idx} item={component} index={idx} />
          ))}
          {position && position.id === PAGE_FLAG && (
            <Divider
              className={classNames(
                itemStyles["lc-item-driver"],
                itemStyles["lc-item-driver__horizontal"]
              )}
            />
          )}
        </Row>
      </Layout.Content>
      <Layout.Sider
        className={classNames(styles["lc-content-action"], {
          "border-none": !activeComponent,
        })}
        width={activeComponent ? 300 : 0}
      >
        {renderAction()}
      </Layout.Sider>
      <Drawer
        title="JSON总览"
        visible={visible}
        footer={null}
        onCancel={() => setVisible(false)}
        width={500}
        placement="left"
      >
        <ReactJson
          src={props.schema as object}
          indentWidth={2}
          iconStyle="square"
          displayDataTypes={false}
        />
      </Drawer>
    </Layout>
  );
};
