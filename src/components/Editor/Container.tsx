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
import { filterComponent, findComponent } from "./utils";
import styles from "./styles/editor-container.module.less";
import itemStyles from "./styles/item.module.less";
import { getRenderActionByName } from "./Menu/data";
import { ModeType, useSettings } from "../Settings";
import { produce } from "@/utils";
import { useGlobalSetting } from "./GlobalSettingsProvider";

const { Row } = Grid;

interface IProps {
  schema: ISchema;
  onChange: (schema: ISchema) => void;
}

export const PAGE_FLAG = "page";

export default function EditorContainer(props: IProps) {
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
      onClick: () => {
        setVisible(true);
      },
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
    const schema = findComponent(
      props.schema,
      (c) => c.id === activeComponent.id
    );
    return (
      <div className="h-full relative">
        <ComponentAction
          schema={schema}
          onChange={(component) => {
            const newSchema = produce(props.schema, (schema) => {
              const currentComponent = findComponent(
                schema,
                (c) => c.id === component.id
              );
              Object.assign(currentComponent, component);
            });
            props.onChange(newSchema);
          }}
        />
      </div>
    );
  }, [activeComponent, props.schema]);

  const { elementMode } = useSettings();
  const { globalSetting } = useGlobalSetting();

  return (
    <Layout className="h-full">
      <Layout.Content className="flex flex-col">
        <Row className={styles["lc-content"]} justify="center">
          <Space className="flex">
            {toolbar.map((tb, idx) => (
              <Tooltip content={tb.content} key={idx}>
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
        className={classNames(
          styles["lc-content-action"],
          !activeComponent ? "ml-0" : "important-ml-[6px]"
        )}
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
          src={
            {
              name: "page",
              ...globalSetting.pageSetting,
              body: props.schema,
            } as object
          }
          indentWidth={2}
          iconStyle="square"
          displayDataTypes={false}
          theme={elementMode === ModeType.DARK ? "mocha" : undefined}
        />
      </Drawer>
    </Layout>
  );
}
