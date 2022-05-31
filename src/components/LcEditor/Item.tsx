import { Divider, Grid, Space } from "@arco-design/web-react";
import { IconDragArrow } from "@arco-design/web-react/icon";
import { useDraggable, useDroppable } from "@dnd-kit/core";
import classNames from "classnames";
import { forwardRef, ReactNode, useCallback, useContext } from "react";
import useHover from "react-use-hover";
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
          "pointer-events-none": disabled,
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
    className?: string;
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
    const { inline, span, children, className, ...resetProps } = props;
    return inline ? (
      <div
        ref={ref}
        className={classNames(styles["lc-child-warp"], className)}
        {...resetProps}
      >
        {children}
      </div>
    ) : (
      <Col
        ref={ref}
        span={span}
        className={classNames(styles["lc-child-warp"], className)}
        {...resetProps}
      >
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
  const [isHovering, hoverProps] = useHover();
  const { activeComponent, setActiveComponent, movingComponent, position } =
    useContext(LcEditorContext);

  const renderDivider = useCallback(() => {
    return (
      <Divider
        className={classNames(
          "border-blue-600",
          inline ? "border-l-2 mx-2" : "border-b-2 my-2"
        )}
        style={
          inline
            ? {
                height: position!.height + 10,
              }
            : { width: position!.width }
        }
        type={inline ? "vertical" : "horizontal"}
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
        className={classNames({
          "opacity-50": isDragging,
          relative: isHovering && !movingComponent,
          [styles["lc-active"]]: activeComponent?.id === id,
          [styles["lc-move"]]:
            container &&
            position &&
            position.id === id &&
            position.direction === Direction.MIDDLE,
        })}
        inline={inline}
        span={24}
        ref={setDragRef}
        {...hoverProps}
        onClick={(e: Event) => {
          e.stopPropagation();
          setActiveComponent(item);
        }}
      >
        {isHovering && !movingComponent && (
          <div
            {...listeners}
            className={classNames(styles["lc-child-action"], "cursor-move")}
          >
            <Space>
              <IconDragArrow />
            </Space>
          </div>
        )}
        <div
          ref={setDropRef}
          className={classNames({ "min-h-80px relative": container })}
        >
          {container ? (
            <>
              <Common {...p} className={classNames("min-h-50px", p?.className)}>
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
