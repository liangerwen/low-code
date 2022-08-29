import useHover from "@/hooks/useHover";
import { Divider, Space, Tooltip } from "@arco-design/web-react";
import {
  IconCopy,
  IconDelete,
  IconDragDot,
  IconPaste,
} from "@arco-design/web-react/icon";
import { useDraggable, useDroppable } from "@dnd-kit/core";
import classNames from "classnames";
import { isEmpty } from "lodash";
import {
  cloneElement,
  forwardRef,
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
      type?: "container" | "onlyContainer";
      wrapper: ReactElement;
    },
    ref: React.LegacyRef<HTMLDivElement>
  ) => {
    const { type, children, action, divider, wrapper, ...rest } = props;
    if (type === "container") {
      return (
        <div {...rest} ref={ref}>
          {action}
          {cloneElement(wrapper, {}, children)}
          {divider}
          <p className={styles["lc-item-tip"]}>拖动组件到此处</p>
        </div>
      );
    }
    if (type === "onlyContainer") {
      return cloneElement(
        wrapper,
        { ...rest, ref: ref },
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
  const {
    id,
    inline,
    container,
    onlyContainer,
    name,
    title,
    props: p,
    children,
  } = item;

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
    const RenderItem = container ? Item : CommonItem;
    return parseChildrenForEditor(children, {
      render: (child, idx) => <RenderItem item={child} index={idx} key={idx} />,
    });
  }, [children, container]);

  const {
    activeComponent,
    setActiveComponent,
    movingComponent,
    position,
    onDelete,
    onCopy,
    onPaste,
  } = useContext(EditorContext);

  const isPrev = useMemo(
    () => position?.id === id && position?.direction === Direction.PREV,
    [position, id]
  );
  const isMiddle = useMemo(
    () => position?.id === id && position?.direction === Direction.MIDDLE,
    [position, id]
  );
  const isNext = useMemo(
    () => position?.id === id && position?.direction === Direction.NEXT,
    [position, id]
  );
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

  const className = useMemo(
    () =>
      classNames(styles["lc-item"], {
        [styles["lc-item__active"]]: isActive,
        [styles["lc-item__dragging"]]: isDragging,
      }),
    [isActive, isDragging, movingComponent]
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

  const wrapperProps = useMemo(
    () => ({
      ...attributes,
      onClick: setActive,
      className: classNames(className, {
        [styles["lc-item__container"]]: container,
        [styles["lc-item__inline"]]: inline,
        "min-w-160px important-pt-[20px]": showActions,
      }),
    }),
    [attributes, setActive, className, inline, showActions]
  );

  return (
    <ErrorBoundary
      fallbackRender={(args) => <ErrorComp {...args} name={name} id={id} />}
    >
      {isPrev && renderDivider()}
      <ItemWrapper
        ref={(ref: HTMLElement) => {
          setDragRef(ref);
          setDropRef(ref);
          setHoverRef(ref);
        }}
        type={
          onlyContainer ? "onlyContainer" : container ? "container" : undefined
        }
        wrapper={
          <Comp
            {...displayProps}
            className={classNames(
              displayProps?.className,
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
        divider={isMiddle && renderDivider()}
        {...wrapperProps}
      >
        {displayChildren}
      </ItemWrapper>
      {isNext && renderDivider()}
    </ErrorBoundary>
  );
};

export default Item;
