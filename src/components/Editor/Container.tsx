import {
  Button,
  Divider,
  Drawer,
  Grid,
  Layout,
  Message,
  Space,
  Tooltip,
} from "@arco-design/web-react";
import {
  IconClose,
  IconCodeBlock,
  IconCopy,
  IconDelete,
  IconEye,
  IconPaste,
  IconSave,
} from "@arco-design/web-react/icon";
import ReactJson from "react-json-view";
import { v4 as uuidv4 } from "uuid";
import classNames from "classnames";
import { useCallback, useContext, useState } from "react";
import { useDroppable } from "@dnd-kit/core";
import { EditorContext } from ".";
import { omit } from "lodash";
import { filterComponent, findComponent, findWarpper } from "./utils";
import { getRenderActionByName } from "./Menu/ComponentsTab/data";
import { ModeType, useSettings } from "../Settings";
import { produce } from "@/utils";
import Item from "./components/Item";

import styles from "./styles/container.module.less";
import itemStyles from "./components/styles/item.module.less";
import { useNavigate } from "react-router-dom";

const { Row } = Grid;

interface IProps {
  schema: ISchema;
  onChange: (schema: ISchema) => void;
  onSave: () => void;
}

export const PAGE_FLAG = "page";

export default function EditorContainer(props: IProps) {
  const navigate = useNavigate();

  const { activeComponent, setActiveComponent, position } =
    useContext(EditorContext);
  const [copy, setCopy] = useState<IComponent | null>(null);

  const onClear = () => {
    props.onChange({ ...props.schema, body: [] });
  };
  const onDelete = () => {
    props.onChange({
      ...props.schema,
      body: filterComponent(
        props.schema.body,
        (c) => c.id !== activeComponent?.id
      ),
    });
    setActiveComponent(null);
  };
  const onCopy = () => {
    if (!activeComponent) {
      Message.error("请选择复制组件");
      return;
    }
    setCopy(omit(activeComponent, "id"));
  };
  const onParse = () => {
    if (!copy) {
      Message.error("请先复制组件");
      return;
    }
    const parseComponent = { ...copy, id: uuidv4() };
    if (!activeComponent) {
      props.onChange({
        ...props.schema,
        body: [...props.schema.body, parseComponent],
      });
    } else {
      const newSchema = produce(props.schema, (schema) => {
        const active = findComponent(
          schema.body,
          (component) => component.id === activeComponent.id
        );
        if (active.container) {
          active.children = [...(active.children || []), parseComponent];
        } else {
          const { warpper, index } = findWarpper(schema.body, active.id);
          if (warpper) {
            warpper.splice(index + 1, 0, parseComponent);
          }
        }
      });
      props.onChange(newSchema);
    }
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
      content: "预览",
      icon: <IconEye />,
      onClick: () => {
        navigate("/preview");
      },
    },
    {
      content: "复制",
      icon: <IconCopy />,
      onClick: onCopy,
    },
    {
      content: "粘贴",
      icon: <IconPaste />,
      onClick: onParse,
    },
    // {
    //   content: "撤销",
    //   icon: <IconUndo />,
    //   // onClick:onCopy,
    // },
    // {
    //   content: "重做",
    //   icon: <IconRedo />,
    //   // onClick:onCopy,
    // },
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
    {
      content: "保存",
      icon: <IconSave />,
      onClick: props.onSave,
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
      props.schema.body,
      (c) => c.id === activeComponent.id
    );
    return (
      <div className="h-full relative">
        <ComponentAction
          schema={schema}
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
