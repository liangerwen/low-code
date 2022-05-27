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
  IconDragArrow,
  IconPaste,
  IconRedo,
  IconUndo,
} from "@arco-design/web-react/icon";
import ReactJson from "react-json-view";
import classNames from "classnames";
import { forwardRef, Fragment, ReactNode, useContext, useState } from "react";
import { LcEditorContext } from ".";
import { filterComponent } from "../../utils";
import { getComponentByName } from "./EditorMenu/data";
import styles from "./styles/editor-container.module.less";
import { Draggable, Droppable } from "react-beautiful-dnd";

const { Row, Col } = Grid;

interface IProps {
  schema: ISchema;
  onChange: (schema: ISchema) => void;
}

export const PAGE_FLAG = "page";

const Warp = forwardRef<
  HTMLDivElement,
  {
    inline?: boolean;
    span: number;
    children?: ReactNode;
    [key: string]: any;
  }
>(
  (
    props = {
      inline: false,
      span: 24,
    },
    ref
  ) => {
    const { inline, span, children, ...resetProps } = props;
    return inline ? (
      <div ref={ref} {...resetProps}>
        {children}
      </div>
    ) : (
      <Col ref={ref} span={span} {...resetProps}>
        {children}
      </Col>
    );
  }
);

export default (props: IProps) => {
  const { activeComponent, setActiveComponent, movingComponent, position } =
    useContext(LcEditorContext);

  const renderComponents = (schema: ISchema, parentId: string = "") => {
    const dividerIdx = parentId
      ? parentId === position.id
        ? position.index
        : -1
      : -1;
    const content = schema.map((c, idx) => {
      if (typeof c === "string") return c;
      const Component = getComponentByName(c.name);
      const active = c.id === activeComponent?.id;
      const divider = dividerIdx === idx;
      if (c.id) {
        return (
          <Fragment key={c.id}>
            {divider && <Divider className="border-blue-600 border-b-2 my-2" />}
            <Draggable draggableId={c.id} index={idx}>
              {(p, s) => (
                <>
                  <Warp
                    ref={p.innerRef}
                    {...p.draggableProps}
                    inline={c.inline}
                    span={24}
                    className={classNames(styles["lc-child-warp"], {
                      [styles["lc-active"]]: active,
                      [styles["lc-move"]]: s.isDragging,
                    })}
                    onClick={(e: Event) => !movingComponent && onActive(e, c)}
                    // {...p.dragHandleProps}
                  >
                    <div
                      className={classNames("hidden", {
                        [styles["lc-child-action"]]: !movingComponent,
                      })}
                      {...p.dragHandleProps}
                    >
                      <Space>
                        <IconDragArrow />
                      </Space>
                    </div>
                    {c.container ? (
                      <>
                        <Droppable
                          droppableId={c.id!}
                          isDropDisabled={s.isDragging ? true : false}
                          renderClone={(provided) => (
                            <div
                              className={styles["lc-moving-component"]}
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              {movingComponent?.name}
                            </div>
                          )}
                        >
                          {(provided, snapshot) => (
                            <>
                              <Component
                                {...c.props}
                                className={classNames(
                                  "pointer-events-none select-none min-h-30px",
                                  {
                                    [styles["lc-move"]]:
                                      snapshot.isDraggingOver,
                                  },
                                  c.props?.className
                                )}
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                              >
                                {renderComponents(
                                  (c.children || []) as ISchema,
                                  c.id
                                )}
                                {provided.placeholder}
                              </Component>
                              <p
                                className={classNames(
                                  "color-#9ca3af m-0 text-center select-none pt-2",
                                  {
                                    [styles["lc-move"]]:
                                      snapshot.isDraggingOver,
                                  }
                                )}
                              >
                                拖动组件到此处
                              </p>
                            </>
                          )}
                        </Droppable>
                      </>
                    ) : (
                      <Component
                        {...c.props}
                        className={classNames(
                          "pointer-events-none select-none",
                          c.props?.className
                        )}
                      >
                        {c.children &&
                          renderComponents(c.children as ISchema, c.id)}
                      </Component>
                    )}
                  </Warp>
                </>
              )}
            </Draggable>
          </Fragment>
        );
      }
      return (
        <Component
          {...c.props}
          key={idx}
          className={classNames(
            "pointer-events-none select-none",
            c.props?.className
          )}
        >
          {c.children && renderComponents(c.children as ISchema)}
        </Component>
      );
    });
    return (
      <>
        {content}
        {dividerIdx >= content.length && (
          <Divider className="border-blue-600 border-b-2 my-2" />
        )}
      </>
    );
  };
  const onActive = (e: Event, component: IComponent) => {
    e.stopPropagation();
    setActiveComponent(component);
  };
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
        <Droppable
          droppableId={PAGE_FLAG}
          renderClone={(provided) => (
            <div
              className={styles["lc-moving-component"]}
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
            >
              {movingComponent?.name}
            </div>
          )}
        >
          {(provided) => (
            <Row
              ref={provided.innerRef}
              {...provided.droppableProps}
              className={[
                styles["lc-content"],
                styles["lc-editor-container"],
                "p-2 h-full flex-1 content-start",
              ]}
              onClick={(e) => {
                e.stopPropagation();
                if (!movingComponent) {
                  setActiveComponent(null);
                }
              }}
            >
              {renderComponents(props.schema, PAGE_FLAG)}
              {provided.placeholder}
            </Row>
          )}
        </Droppable>
      </Layout.Content>
      <Layout.Sider
        className={[styles["lc-content"], "border-none ml-2 shadow-none"]}
        width={activeComponent ? 300 : 0}
      ></Layout.Sider>
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
