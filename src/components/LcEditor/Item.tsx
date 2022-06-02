import { Divider, Grid, Space } from "@arco-design/web-react";
import { IconDragDot } from "@arco-design/web-react/icon";
import { useDraggable, useDroppable } from "@dnd-kit/core";
import classNames from "classnames";
import { forwardRef, ReactNode, useCallback, useContext } from "react";
import styles from "./styles/item.module.less";
import { Direction, LcEditorContext } from ".";
import { getComponentByName } from "./EditorMenu/data";

const { Col } = Grid;

interface IProps {
  item: IComponent;
  index: number;
}

export const renderCommonComponents = (
  demo: (IComponent | string)[],
  disabled = false
) => {
  return demo.map((component, idx) => {
    if (typeof component === "string") return component;
    const Common = getComponentByName(component.name);
    return (
      <Common
        {...component.props}
        key={idx}
        className={classNames(component.props?.className, {
          "pointer-events-none select-none": disabled,
        })}
      >
        {component?.children?.length &&
          renderCommonComponents(component.children, disabled)}
      </Common>
    );
  });
};

const ItemWarp = forwardRef<
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

const Item = (props: IProps) => {
  const { item, index } = props;
  const { id, inline, container, name, props: p, children = [] } = item;

  const {
    attributes,
    listeners,
    setNodeRef: setDragRef,
    isDragging,
  } = useDraggable({
    id: id!,
    data: item,
    attributes: { tabIndex: index },
  });
  const { setNodeRef: setDropRef } = useDroppable({
    id: id!,
    data: item,
  });
  const Common = getComponentByName(name);
  const { activeComponent, setActiveComponent, movingComponent, position } =
    useContext(LcEditorContext);

  const renderDivider = useCallback(() => {
    const isVertical = inline && movingComponent?.inline;
    return (
      <Divider
        className={classNames(
          styles["lc-item-driver"],
          isVertical
            ? styles["lc-item-driver__vertical"]
            : styles["lc-item-driver__horizontal"]
        )}
        style={
          isVertical
            ? {
                height: position!.height + 10,
              }
            : { width: position!.width }
        }
        type={isVertical ? "vertical" : "horizontal"}
      />
    );
  }, [position, inline]);

  return (
    <>
      {position &&
        position.id === id &&
        position.direction === Direction.PREV &&
        renderDivider()}
      <ItemWarp
        {...attributes}
        className={classNames(styles["lc-item"], "mb-0.5", {
          "mr-0.5": inline,
          [styles["lc-item__dragging"]]: isDragging,
          [styles["lc-item__hover"]]: !movingComponent,
          [styles["lc-item__active"]]: activeComponent?.id === id,
          [styles["lc-item__enter"]]:
            container &&
            position &&
            position.id === id &&
            position.direction === Direction.MIDDLE,
        })}
        inline={inline}
        span={24}
        ref={setDragRef}
        onClick={(e: Event) => {
          e.stopPropagation();
          setActiveComponent(item);
        }}
      >
        {!movingComponent && (
          <div className={classNames(styles["lc-item-action"], "cursor-move")}>
            <Space>
              <IconDragDot {...listeners} />
            </Space>
          </div>
        )}
        <div
          ref={setDropRef}
          className={classNames(
            { "min-h-80px relative": container },
            "rounded bg-white"
          )}
        >
          {container ? (
            <>
              <Common {...p} className={classNames("min-h-60px", p?.className)}>
                {children.length > 0 &&
                  (children as IComponent[]).map((c, idx) => (
                    <Item item={c} key={idx} index={idx} />
                  ))}
              </Common>
              {position &&
                position.id === id &&
                position.direction === Direction.MIDDLE &&
                renderDivider()}
              <p
                className={classNames(
                  "color-#9ca3af m-0 text-center select-none"
                )}
              >
                拖动组件到此处
              </p>
            </>
          ) : (
            renderCommonComponents([item], true)
          )}
        </div>
      </ItemWarp>
      {position &&
        position.id === id &&
        position.direction === Direction.NEXT &&
        renderDivider()}
    </>
  );
};

export default Item;
