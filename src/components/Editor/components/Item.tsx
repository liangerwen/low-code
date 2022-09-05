import useHover from "@/hooks/useHover";
import { Space, Tooltip } from "@arco-design/web-react";
import {
  IconCopy,
  IconDelete,
  IconDragDot,
  IconPaste,
} from "@arco-design/web-react/icon";
import { useDraggable, useDroppable } from "@dnd-kit/core";
import classNames from "classnames";
import {
  cloneElement,
  forwardRef,
  LegacyRef,
  ReactElement,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
} from "react";
import { ErrorBoundary } from "react-error-boundary";
import { Direction, EditorContext } from "..";
import { getComponentByName } from "../Menu/ComponentsTab/data";
import { parseChildrenForEditor, parsePropsForEditor } from "../utils/parse";
import ErrorComp from "./ErrorComp";

import styles from "./styles/item.module.less";

interface IProps {
  item: IComponent;
  index: number;
}

export function CommonItem({ item }) {
  const { id, name, props: p = {}, children } = item as IComponent;

  const Common = getComponentByName(name);
  const commonProps = useMemo(() => parsePropsForEditor(p), [p]);
  const commonChildren = useMemo(
    () =>
      parseChildrenForEditor(children, {
        render: (child, idx) => <CommonItem item={child} key={idx} />,
      }),
    [children]
  );

  return (
    <ErrorBoundary
      fallbackRender={(args) => <ErrorComp {...args} name={name} id={id} />}
    >
      <Common
        {...commonProps}
        className={classNames(
          commonProps?.className,
          "important-relative important-top-0 important-left-0 important-right-0 important-bottom-0 pointer-events-none select-none"
        )}
      >
        {commonChildren}
      </Common>
    </ErrorBoundary>
  );
}

const ItemWrapper = forwardRef(
  (
    props: {
      children?: ReactNode;
      action?: ReactNode;
      divider?: ReactNode;
      type?: "inner" | "outside" | "self";
      wrapper: ReactElement;
      [key: string]: any;
    },
    ref: LegacyRef<HTMLDivElement>
  ) => {
    const { type, children, action, divider, wrapper, ...rest } = props;

    if (type === "inner") {
      return (
        <div {...rest} ref={ref}>
          {action}
          {cloneElement(
            wrapper,
            {},
            children,
            divider,
            <p className={styles["lc-item-tip"]}>拖动组件到此处</p>
          )}
        </div>
      );
    }
    if (type === "outside") {
      return (
        <div {...rest} ref={ref}>
          {action}
          {cloneElement(wrapper, {}, children)}
          {divider}
          <p className={styles["lc-item-tip"]}>拖动组件到此处</p>
        </div>
      );
    }
    if (type === "self") {
      const className = classNames(wrapper.props?.className, rest.className);
      return cloneElement(
        wrapper,
        { ...rest, className, ref: ref },
        action,
        children,
        divider,
        <p className={styles["lc-item-tip"]}>拖动组件到此处</p>
      );
    }
    return (
      <div {...rest} ref={ref}>
        {action}
        {cloneElement(wrapper, {}, children)}
        {divider}
      </div>
    );
  }
);

const Item = (props: IProps) => {
  const { item, index } = props;
  const { id, inline, container, name, title, props: p, children } = item;

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

  const Comp = getComponentByName(name);
  const displayProps = useMemo(() => parsePropsForEditor(p), [p]);
  const displayChildren = useMemo(() => {
    const RenderItem = !!container ? Item : CommonItem;
    return parseChildrenForEditor(children, {
      render: (child, idx) => <RenderItem item={child} index={idx} key={idx} />,
    });
  }, [children, !!container]);

  const {
    activeComponent,
    setActiveComponent,
    movingComponent,
    position,
    onDelete,
    onCopy,
    onPaste,
  } = useContext(EditorContext);

  const isActive = useMemo(
    () => activeComponent?.id === id,
    [activeComponent, id]
  );

  const setActive = useCallback(
    (e) => {
      e.stopPropagation();
      setActiveComponent(item);
    },
    [setActiveComponent, item]
  );

  const [setHoverRef, isHover] = useHover<HTMLElement>();

  const showActions = useMemo(
    () => isHover && !movingComponent,
    [movingComponent, isHover]
  );
  const actions = useMemo(
    () => [
      { element: IconCopy, tip: "复制", onClick: () => onCopy(item) },
      { element: IconPaste, tip: "粘贴", onClick: () => onPaste(item) },
      { element: IconDelete, tip: "删除", onClick: () => onDelete(id) },
    ],
    [item, onDelete, onPaste, onCopy]
  );

  // 上下左右中预览样式
  const dividerClass = useMemo(() => {
    if (position?.id !== id) return;
    switch (position?.direction) {
      case Direction.TOP:
        return "important-border-t-[rgb(var(--primary-6))] important-border-t-4";
      case Direction.LEFT:
        return "important-border-l-[rgb(var(--primary-6))] important-border-l-4";
      case Direction.BOTTOM:
        return "important-border-b-[rgb(var(--primary-6))] important-border-b-4";
      case Direction.RIGHT:
        return "important-border-r-[rgb(var(--primary-6))] important-border-r-4";
      case Direction.MIDDLE:
        return "important-bg-[rgb(var(--primary-2))]";
    }
  }, [position, id]);

  const wrapperProps = useMemo(
    () => ({
      ...attributes,
      onClick: setActive,
      className: classNames(styles["lc-item"], dividerClass, {
        [styles["lc-item__active"]]: isActive && !movingComponent,
        [styles["lc-item__dragging"]]: isDragging,
        [styles["lc-item__inline"]]: inline,
        "important-pb-25px": container,
        "min-w-160px important-pt-[20px]": showActions,
      }),
    }),
    [
      attributes,
      setActive,
      inline,
      showActions,
      isActive,
      isDragging,
      movingComponent,
      dividerClass,
    ]
  );

  return (
    <ErrorBoundary
      fallbackRender={(args) => <ErrorComp {...args} name={name} id={id} />}
    >
      <ItemWrapper
        ref={(ref: HTMLElement) => {
          setDragRef(ref);
          setDropRef(ref);
          setHoverRef(ref);
        }}
        type={container}
        wrapper={
          <Comp
            {...displayProps}
            className={classNames(
              displayProps?.className,
              {
                [styles["lc-item__container"]]: !!container,
                "important-min-h-[90px]": container === "self",
              },
              "pointer-events-none select-none"
            )}
          />
        }
        action={
          showActions && (
            <div className={styles["lc-item-action"]}>
              <Space>
                <IconDragDot
                  {...listeners}
                  className="cursor-move hover:bg-[rgba(0,0,0,0.05)]"
                />
                <span>{title}</span>
                {actions.map((i, idx) => {
                  const Icon = i.element;
                  return (
                    <Tooltip content={i.tip} mini key={idx}>
                      <Icon
                        key={idx}
                        className="cursor-pointer hover:bg-[rgba(0,0,0,0.05)]"
                        onClick={(e) => {
                          e.stopPropagation();
                          i.onClick();
                        }}
                      />
                    </Tooltip>
                  );
                })}
              </Space>
            </div>
          )
        }
        {...wrapperProps}
      >
        {displayChildren}
      </ItemWrapper>
    </ErrorBoundary>
  );
};

export default Item;
