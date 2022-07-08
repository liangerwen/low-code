import { Divider, Grid, Space } from "@arco-design/web-react";
import { IconDragDot } from "@arco-design/web-react/icon";
import { useDraggable, useDroppable } from "@dnd-kit/core";
import classNames from "classnames";
import { forwardRef, ReactNode, useCallback, useContext, useMemo } from "react";
import styles from "./styles/item.module.less";
import { Direction, EditorContext } from ".";
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
    id,
    data: item,
    attributes: { tabIndex: index },
  });
  const { setNodeRef: setDropRef } = useDroppable({
    id,
    data: item,
  });
  const Common = getComponentByName(name);
  const { activeComponent, setActiveComponent, movingComponent, position } =
    useContext(EditorContext);

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

  const isActive = useMemo(() => activeComponent?.id === id, [activeComponent]);
  const isEnter = useMemo(
    () =>
      container &&
      position &&
      position.id === id &&
      position.direction === Direction.MIDDLE,
    [position]
  );

  return (
    <>
      {position &&
        position.id === id &&
        position.direction === Direction.PREV &&
        renderDivider()}
      <ItemWarp
        {...attributes}
        className={classNames(styles["lc-item"], {
          [styles["lc-item__inline"]]: inline,
          [styles["lc-item__dragging"]]: isDragging,
          [styles["lc-item__hover"]]: !movingComponent,
          [styles["lc-item__active"]]: isActive,
          [styles["lc-item__enter"]]: isEnter,
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
          <div className={styles["lc-item-action"]}>
            <Space>
              <IconDragDot {...listeners} />
            </Space>
          </div>
        )}
        <div
          ref={setDropRef}
          className={classNames(styles["lc-item-content"], {
            [styles["lc-item-content__drop"]]: container,
          })}
        >
          {container ? (
            <>
              <Common
                {...p}
                className={classNames(
                  styles["lc-item-content-main"],
                  p?.className
                )}
              >
                {children.length > 0 &&
                  (children as IComponent[]).map((c, idx) => (
                    <Item item={c} key={idx} index={idx} />
                  ))}
              </Common>
              {position &&
                position.id === id &&
                position.direction === Direction.MIDDLE &&
                renderDivider()}
              <p className={styles["lc-item-content-tip"]}>拖动组件到此处</p>
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
