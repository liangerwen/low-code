import {
  Button,
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
import { useAutoAnimate } from "@formkit/auto-animate/react";
import ReactJson from "react-json-view";
import classNames from "classnames";
import { ReactNode, useContext, useState } from "react";
import { LcEditorContext } from ".";
import { filterComponent, findComponent, updateObject } from "../../utils";
import { getComponentByName } from "./EditorMenu/data";
import styles from "./styles/editor-container.module.less";

const { Row, Col } = Grid;

interface IProps {
  schema: ISchema;
  onChange: (schema: ISchema) => void;
}

const PAGE_FLAG = "page";

const Warp = (
  props: {
    inline?: boolean;
    span: number;
    children?: ReactNode;
    [key: string]: any;
  } = { inline: false, span: 24 }
) => {
  const [animationParent] = useAutoAnimate<HTMLDivElement>({ duration: 150 });
  const { inline, span, children, ...resetProps } = props;
  return inline ? (
    <div ref={animationParent} {...resetProps}>
      {children}
    </div>
  ) : (
    <Col ref={animationParent} span={span} {...resetProps}>
      {children}
    </Col>
  );
};

export default (props: IProps) => {
  const {
    activeComponent,
    moveComponent,
    setActiveComponent,
    setMoveComponent,
  } = useContext(LcEditorContext);

  const renderComponents = (schema: ISchema) => {
    return schema.map((s, idx) => {
      if (typeof s === "string") return s;
      const Component = getComponentByName(s.name);
      const move = s.id === moveComponent?.id;
      const avtive = s.id === activeComponent?.id;
      const events = s.container
        ? {
            onDrop,
            onDragOver: (e: DragEvent) => onDragOver(e, s.id),
            onDragLeave: (e: DragEvent) => onDragLeave(e, s.id),
            onDragEnter: (e: DragEvent) => onDragEnter(e, s.id),
            onClick: (e: Event) => onActive(e, s),
          }
        : {
            onClick: (e: Event) => onActive(e, s),
            onDragOver: (e: DragEvent) => onDragOver(e, s.id),
          };
      if (s.id) {
        return (
          <Warp
            key={s.id}
            inline={s.inline}
            span={24}
            className={classNames(styles["lc-child-warp"], {
              [styles["lc-avtive"]]: avtive,
              [styles["lc-move"]]: move,
              "pointer-events-none": move || (!!moveComponent && !s.container),
            })}
            {...events}
          >
            <Component
              {...s.props}
              className={classNames(
                "pointer-events-none select-none",
                s.props?.className
              )}
            >
              {s.children && renderComponents(s.children as ISchema)}
            </Component>
            {s.container && (
              <p className="color-#9ca3af mb-0 text-center select-none">
                拖动组件到此处
              </p>
            )}
          </Warp>
        );
      }
      return (
        <Component
          {...s.props}
          key={idx}
          className={classNames(
            "pointer-events-none select-none",
            s.props?.className
          )}
        >
          {s.children && renderComponents(s.children as ISchema)}
        </Component>
      );
    });
  };

  // 用于判定组件dragleave容器时是否还在页面容器内部
  let isInContainer = false;

  const onDragEnter = (e: DragEvent, id?: string) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer!.dropEffect = "move";
    if (id === PAGE_FLAG) {
      isInContainer = false;
    } else {
      isInContainer = true;
    }
    const excludeMoveComponentSchema = filterComponent(
      props.schema,
      (c) => c.id !== moveComponent?.id
    );
    const newSchema =
      id === PAGE_FLAG
        ? [...excludeMoveComponentSchema, moveComponent!]
        : updateObject(excludeMoveComponentSchema, (schema) => {
            const warpComponent = findComponent(schema, (c) => c.id === id);
            if (warpComponent && warpComponent.container) {
              if (warpComponent.children) {
                warpComponent.children.push(moveComponent!);
              } else {
                warpComponent.children = [moveComponent!];
              }
            }
          });
    props.onChange(newSchema);
  };
  const onDragLeave = (e: DragEvent, id?: string) => {
    e.preventDefault();
    e.stopPropagation();
    // 如果组件不在容器内部并且当前容器是页面则移除该组件
    if (!isInContainer && id === PAGE_FLAG) {
      props.onChange(
        filterComponent(props.schema, (c) => c.id !== moveComponent?.id)
      );
    }
  };
  const onDragOver = (e: DragEvent, id?: string) => {
    e.preventDefault();
    e.stopPropagation();
    console.log(id);
  };
  const onDrop = (e: DragEvent) => {
    setActiveComponent(moveComponent);
    setMoveComponent(null);
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

  const [animationParent] = useAutoAnimate({ duration: 150 });

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
          onClick={() => setActiveComponent(null)}
          // @ts-ignore
          onDragEnter={(e: DragEvent) => onDragEnter(e, PAGE_FLAG)}
          // @ts-ignore
          onDragLeave={(e: DragEvent) => onDragLeave(e, PAGE_FLAG)}
          // @ts-ignore
          onDragOver={(e: DragEvent) => onDragOver(e, PAGE_FLAG)}
          // @ts-ignore
          onDrop={onDrop}
          ref={animationParent}
        >
          {renderComponents(props.schema)}
        </Row>
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
