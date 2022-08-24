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
  IconEye,
  IconRedo,
  IconSave,
  IconUndo,
} from "@arco-design/web-react/icon";
import ReactJson from "react-json-view";
import classNames from "classnames";
import { useCallback, useContext, useState } from "react";
import { useDroppable } from "@dnd-kit/core";
import { EditorContext } from ".";
import { findComponent } from "./utils";
import { getRenderActionByName } from "./Menu/ComponentsTab/data";
import { ModeType, useSettings } from "../Settings";
import { produce } from "@/utils";
import Item from "./components/Item";

import styles from "./styles/container.module.less";
import itemStyles from "./components/styles/item.module.less";

const { Row } = Grid;

interface IProps {
  schema: ISchema;
  onChange: (schema: ISchema) => void;
}

export const PAGE_FLAG = "page";

export default function EditorContainer(props: IProps) {
  const {
    activeComponent,
    setActiveComponent,
    position,
    onSave,
    onPreview,
    onClear,
    onBack,
    onForward,
  } = useContext(EditorContext);

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
      content: "预览",
      icon: <IconEye />,
      onClick: onPreview,
    },
    {
      content: "撤销",
      icon: <IconUndo />,
      onClick: onBack,
    },
    {
      content: "恢复",
      icon: <IconRedo />,
      onClick: onForward,
    },
    {
      content: "清空",
      icon: <IconClose />,
      onClick: onClear,
    },
    {
      content: "保存",
      icon: <IconSave />,
      onClick: onSave,
    },
  ];

  const { setNodeRef } = useDroppable({
    id: "page",
  });

  const renderAction = useCallback(() => {
    if (!activeComponent) return null;
    const ComponentAction = getRenderActionByName(activeComponent.name);
    if (!ComponentAction) return null;
    const component = findComponent(
      props.schema.body,
      (c) => c.id === activeComponent.id
    );
    if (!component) return null;
    return (
      <div className="h-full relative">
        <ComponentAction
          component={component}
          schema={props.schema}
          onChange={(component) => {
            const newSchema = produce(props.schema, (schema) => {
              const currentComponent = findComponent(
                schema.body,
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
        <div
          className={classNames(
            styles["lc-content"],
            styles["lc-editor-container"],
            "p-2 h-full flex-1"
          )}
          onClick={(e) => {
            e.stopPropagation();
            setActiveComponent(null);
          }}
          ref={setNodeRef}
        >
          {props.schema.body.map((component, idx) => (
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
        </div>
      </Layout.Content>
      <Layout.Sider
        className={classNames(
          styles["lc-content-action"],
          !activeComponent ? "ml-0" : "important-ml-[6px]"
        )}
        width={activeComponent ? 350 : 0}
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
          theme={elementMode === ModeType.DARK ? "mocha" : undefined}
        />
      </Drawer>
    </Layout>
  );
}
