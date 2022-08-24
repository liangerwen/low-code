import useHover from "@/hooks/useHover";
import { produce } from "@/utils";
import { Divider, Space, Tooltip } from "@arco-design/web-react";
import {
  IconCopy,
  IconDelete,
  IconDragDot,
  IconPaste,
} from "@arco-design/web-react/icon";
import { useDraggable, useDroppable } from "@dnd-kit/core";
import classNames from "classnames";
import { isEmpty, mergeWith } from "lodash";
import {
  FC,
  forwardRef,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
} from "react";
import { ErrorBoundary } from "react-error-boundary";
import { Direction, EditorContext } from "..";
import { getComponentByName } from "../Menu/ComponentsTab/data";
import { parseChildren, parsePropsForEditor } from "../utils/parse";
import ErrorComp from "./ErrorComp";

import styles from "./styles/item.module.less";

interface IProps {
  item: IComponent;
  index: number;
}

export function CommonItem({ item, disabled = false }) {
  const { id, name, props: p = {}, children } = item as IComponent;

  const Common = getComponentByName(name);
  const commonProps = useMemo(() => parsePropsForEditor(p), [p]);
  const commonChildren = useMemo(
    () =>
      parseChildren(children, {
        render: (child, idx) => (
          <CommonItem item={child} disabled={disabled} key={idx} />
        ),
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
          "important-relative important-top-0 important-left-0 important-right-0 important-bottom-0",
          {
            "pointer-events-none select-none": disabled,
          }
        )}
      >
        {commonChildren}
      </Common>
    </ErrorBoundary>
  );
}

const ItemWarpper = forwardRef(
  (
    props: {
      type?: "warpper" | "selfWarpper";
      Component: FC<any>;
      children?: ReactNode;
      containerWarpperProps: Record<string, any>;
      childrenWarpperProps: Record<string, any>;
      selfProps: Record<string, any>;
      action?: ReactNode;
    },
    ref: React.LegacyRef<HTMLDivElement>
  ) => {
    const {
      type,
      Component,
      children,
      containerWarpperProps,
      childrenWarpperProps,
      selfProps,
      action,
    } = props;
    if (type === "selfWarpper") {
      const p = mergeWith(
        containerWarpperProps,
        childrenWarpperProps,
        selfProps,
        (oldV, newV, key) => {
          if (key === "className") {
            return classNames(oldV, newV);
          }
        }
      );
      return (
        <Component {...p} ref={ref}>
          {action}
          {children}
        </Component>
      );
    }
    if (type === "warpper") {
      return (
        <div {...containerWarpperProps} ref={ref}>
          {action}
          <Component {...selfProps}>
            <div {...childrenWarpperProps}>{children}</div>
          </Component>
        </div>
      );
    }

    const p = mergeWith(
      containerWarpperProps,
      childrenWarpperProps,
      (oldV, newV, key) => {
        if (key === "className") {
          return classNames(oldV, newV);
        }
      }
    );
    return (
      <div {...p} ref={ref}>
        {action}
        {children}
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

  return (
    <ErrorBoundary
      fallbackRender={(args) => <ErrorComp {...args} name={name} id={id} />}
    >
      {isPrev && renderDivider()}
      <ItemWarpper
        ref={(ref: HTMLElement) => {
          setDragRef(ref);
          setDropRef(ref);
          setHoverRef(ref);
        }}
        type={
          container && onlyContainer
            ? "selfWarpper"
            : container
            ? "warpper"
            : undefined
        }
        Component={Comp}
        containerWarpperProps={{
          ...attributes,
          onClick: setActive,
          className: classNames(className, {
            [styles["lc-item__inline"]]: inline,
            "min-w-160px important-pt-[20px]": showActions,
          }),
        }}
        childrenWarpperProps={{
          className: classNames({
            [styles["lc-item__container"]]: container,
          }),
        }}
        selfProps={{
          ...parsePropsForEditor(p),
        }}
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
      >
        {container ? (
          <>
            {!isEmpty(children) &&
              (children as IComponent[]).map((c, idx) => (
                <Item item={c} key={idx} index={idx} />
              ))}
            {isMiddle && renderDivider()}
            <p className={styles["lc-item-tip"]}>拖动组件到此处</p>
          </>
        ) : (
          <CommonItem item={item} disabled={true} />
        )}
      </ItemWarpper>
      {isNext && renderDivider()}
    </ErrorBoundary>
  );
};

export default Item;
