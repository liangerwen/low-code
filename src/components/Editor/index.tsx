import { Layout, Message } from "@arco-design/web-react";
import classNames from "classnames";
import { generate as uuid } from "shortid";
import { createContext, useCallback, useEffect, useRef, useState } from "react";
import { render } from "less";
import EditorContainer, { PAGE_FLAG } from "./Container";
import EditorMenu from "./Menu";
import styles from "./styles/index.module.less";
import {
  DndContext,
  DragEndEvent,
  DragMoveEvent,
  DragOverlay,
  DragStartEvent,
  MouseSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { createPortal } from "react-dom";
import { cloneDeep, isEqual, isPlainObject } from "lodash";
import { copy, deepProduce, produce } from "@/utils";
import {
  filterComponent,
  findComponent,
  findWrapper,
  isParentComponent,
} from "./utils";
import { isAdd } from "./Menu/ComponentsTab/MenuItem";
import Viewer from "./Viewer";
import { useSettings } from "../Settings";

export enum Direction {
  TOP,
  LEFT,
  BOTTOM,
  RIGHT,
  MIDDLE,
}

type PositionType = {
  id: string | number; // 当前位置的元素的id
  direction: Direction; // 是否为上一个元素 反之为下一个
  height: number; // 当前元素的高度
  width: number; // 当前元素的宽度
} | null;
interface IProvider {
  setActiveComponent: (component: null | IComponent) => void;
  activeComponent: null | IComponent;
  movingComponent: null | IComponent;
  position: PositionType;
  onCopy: (component: null | IComponent) => void;
  onPaste: (component: null | IComponent) => void;
  onDelete: (id: string) => void;
  onClear: () => void;
  onForward: () => void;
  onBack: () => void;
  onSave: () => void;
  onPreview: () => void;
  globalData: Record<string, any>;
}

export const EditorContext = createContext<IProvider>({
  setActiveComponent: () => {},
  activeComponent: null,
  movingComponent: null,
  position: null,
  onCopy: () => {},
  onPaste: () => {},
  onDelete: () => {},
  onClear: () => {},
  onForward: () => {},
  onBack: () => {},
  onSave: () => {},
  onPreview: () => {},
  globalData: {},
});

interface IProps {
  value: ISchema;
  onChange: (schema: ISchema) => void;
  onSave: (schema: ISchema) => void;
  onPreview: (schema: ISchema) => void;
}

const Editor = (props: IProps) => {
  const { value, onChange, onSave, onPreview } = props;
  const [activeComponent, setActiveComponent] = useState<IComponent | null>(
    null
  );
  const [movingComponent, setMovingComponent] = useState<IComponent | null>(
    null
  );
  const [position, setPosition] = useState<PositionType>(null);

  const [active, setActive] = useState<null | string>(null);

  const dragOverlayRef = useRef(null);

  const onDragStart = useCallback((e: DragStartEvent) => {
    const {
      active: { id },
    } = e;
    if (isAdd(id)) {
      setMovingComponent({
        ...(e.active.data.current as IComponent),
        id: uuid(),
      });
    } else {
      setMovingComponent(e.active.data.current as IComponent);
    }
    setActive(e.active.data.current?.title);
  }, []);

  const onDragMove = useCallback(
    (e: DragMoveEvent) => {
      const {
        activatorEvent,
        over,
        active: { id: activeId },
      } = e;
      const { x, y } = activatorEvent as PointerEvent;
      // 因为DragMoveEvent里的delta会经过滚动处理，当容器滚动后x和y不准确，所以使用此方法获取正确的delta值
      const [translateX, translateY] = getComputedStyle(dragOverlayRef.current)
        .transform.replace(
          /^matrix\(-?\d+, -?\d+, -?\d+, -?\d+, (-?\d+), (-?\d+)\)$/,
          "$1,$2"
        )
        .split(",");
      const delta = {
        x: Number(translateX || 0),
        y: Number(translateY || 0),
      };
      // 当前坐标为原始坐标加上拖动的偏移量
      const currentX = x + delta.x,
        currentY = y + delta.y;
      if (over) {
        const {
          id: overId,
          rect: { top, left, bottom, right, height, width },
          data: { current },
        } = over;
        // 当前元素是目标元素的祖父
        if (!isAdd(activeId)) {
          const currentComponent = findComponent(
            value.body,
            (c) => c?.id === activeId
          );
          if (
            currentComponent &&
            findComponent([currentComponent], (c) => c?.id === overId)
          ) {
            setPosition(null);
            return;
          }
        }
        let direction: Direction;
        if (current?.container) {
          const diffTop = currentY - top,
            diffLeft = currentX - left,
            diffBottom = currentY - bottom,
            diffRight = currentX - right;
          const isTop = diffTop <= 15,
            isLeft = diffLeft <= 15,
            isBottom = diffBottom >= -15,
            isRight = diffRight >= -15;
          direction = isTop
            ? Direction.TOP
            : isLeft
            ? Direction.LEFT
            : isBottom
            ? Direction.BOTTOM
            : isRight
            ? Direction.RIGHT
            : Direction.MIDDLE;
        } else {
          const percentX = (currentX - left) / width,
            percentY = (currentY - top) / height;
          const isTop = percentY <= 1 / 4,
            isLeft = percentX <= 1 / 4,
            isBottom = percentY > 3 / 4,
            isRight = percentX > 3 / 4;
          direction = isTop
            ? Direction.TOP
            : isLeft
            ? Direction.LEFT
            : isBottom
            ? Direction.BOTTOM
            : isRight
            ? Direction.RIGHT
            : current?.inline
            ? Direction.RIGHT
            : Direction.BOTTOM;
        }
        const currentPosition = {
          id: overId,
          direction,
          height,
          width,
        };
        if (!isEqual(currentPosition, position)) {
          setPosition(currentPosition);
        }
      } else {
        setPosition(null);
      }
    },
    [position, value, movingComponent]
  );

  const onDragEnd = useCallback(
    (e: DragEndEvent) => {
      const {
        active: { id },
      } = e;
      if (position && movingComponent) {
        let newBody = value.body;
        const targetId = position.id,
          targetDirection = position.direction;
        // 如果不是新增就先移除当前组件
        if (!isAdd(id)) {
          newBody = filterComponent(newBody, (c) => c?.id !== id);
        }
        // 根页面直接push
        if (targetId === PAGE_FLAG) {
          newBody = [...newBody, movingComponent];
        } else {
          newBody = produce(newBody, (schema) => {
            const targetComponent = findComponent(
              schema,
              (c) => c?.id === targetId
            );
            if (targetComponent) {
              // 目标组件是容器组件时就放置到此组件中
              if (targetDirection === Direction.MIDDLE) {
                targetComponent.children = [
                  ...(targetComponent.children || []),
                  movingComponent!,
                ];
              } else {
                // 找到目标组件的wrapper组件并根据方向进行前插或后插
                const wrapperInfo = findWrapper(schema, targetId);
                if (wrapperInfo) {
                  const { wrapper, index } = wrapperInfo;
                  if (
                    targetDirection === Direction.TOP ||
                    targetDirection === Direction.LEFT
                  ) {
                    wrapper.splice(index, 0, movingComponent);
                    // 放置到目标组件的后一个
                  } else if (
                    targetDirection === Direction.RIGHT ||
                    targetDirection === Direction.BOTTOM
                  ) {
                    wrapper.splice(index + 1, 0, movingComponent);
                  }
                }
              }
            }
          });
        }
        if (!isEqual(value, newBody)) {
          const newSchema = { ...value, body: newBody };
          onChange(newSchema);
          historyRef.current.unshift(newSchema);
          if (historyRef.current.length > 30) {
            historyRef.current.pop();
          }
          if (isAdd(id)) {
            setActiveComponent(movingComponent);
          }
        }
      }
      setActive(null);
      setPosition(null);
      setMovingComponent(null);
    },
    [value, position, movingComponent]
  );

  const historyRef = useRef<ISchema[]>([value]);
  const forwardRef = useRef<ISchema[]>([]);
  const MAXLEN = 30;
  const stackPush = (stack, val) => {
    stack.unshift(val);
    if (stack.length > MAXLEN) {
      stack.pop();
    }
  };

  const copyRef = useRef<IComponent>(null);

  const onCopy = (component: IComponent) => {
    copyRef.current = cloneDeep(component);
    copy(
      JSON.stringify(
        deepProduce(component, (value) => {
          if (isPlainObject(value) && value?.id) {
            delete value.id;
          }
        })
      )
    );
    Message.success("复制成功！");
  };

  const onPaste = (item: IComponent) => {
    if (!copyRef.current) {
      Message.error("请先复制组件！");
      return;
    }
    const parseComponent = deepProduce(copyRef.current, (value) => {
      if (isPlainObject(value) && value?.id) {
        value.id = uuid();
      }
    });
    if (!item) {
      const newSchema = {
        ...value,
        body: [...value.body, parseComponent],
      };
      onChange(newSchema);
      stackPush(historyRef.current, newSchema);
    } else {
      const newSchema = produce(value, (schema) => {
        const active = findComponent(
          schema.body,
          (component) => component.id === item.id
        );
        if (active.container) {
          active.children = [...(active.children || []), parseComponent];
        } else {
          const { wrapper, index } = findWrapper(schema.body, active.id);
          if (wrapper) {
            wrapper.splice(index + 1, 0, parseComponent);
          }
        }
      });
      stackPush(historyRef.current, newSchema);
      onChange(newSchema);
    }
  };

  const onClear = () => {
    setActiveComponent(null);
    const newSchema = { ...value, body: [] };
    onChange(newSchema);
    stackPush(historyRef.current, newSchema);
  };

  const onDelete = (id: string) => {
    if (
      id === activeComponent?.id ||
      isParentComponent(value.body, id, activeComponent?.id)
    ) {
      setActiveComponent(null);
    }
    const newSchema = {
      ...value,
      body: filterComponent(value.body, (c) => c.id !== id),
    };
    onChange(newSchema);
    stackPush(historyRef.current, newSchema);
  };

  const onForward = () => {
    const forwardSchema = forwardRef.current.shift();
    if (!forwardSchema) {
      Message.warning("无可恢复的内容");
      return;
    }
    setActiveComponent(null);
    stackPush(historyRef.current, forwardSchema);
    onChange(forwardSchema);
  };

  const onBack = () => {
    if (historyRef.current.length <= 1) {
      Message.warning("无可撤销的内容");
      return;
    }
    setActiveComponent(null);
    stackPush(forwardRef.current, historyRef.current.shift());
    onChange(historyRef.current[0]);
  };

  const { pageSetting } = useSettings();

  const mouseSensor = useSensor(MouseSensor);

  const sensors = useSensors(mouseSensor);

  useEffect(() => {
    const { css = "" } = value;
    let url, stylesheet;
    if (css.trim()) {
      stylesheet = document.createElement("link");
      stylesheet.setAttribute("rel", "stylesheet");
      render(css).then((res) => {
        const file = new Blob([res.css], { type: "text/css" });
        url = URL.createObjectURL(file);
        stylesheet.setAttribute("href", url);
        document.head.appendChild(stylesheet);
      });
    }
    return () => {
      url && URL.revokeObjectURL(url);
      stylesheet && document.head.removeChild(stylesheet);
    };
  }, [value.css]);

  return (
    <EditorContext.Provider
      value={{
        setActiveComponent,
        activeComponent,
        movingComponent,
        position,
        onCopy,
        onPaste,
        onDelete,
        onClear,
        onSave: () => onSave(value),
        onPreview: () => onPreview(value),
        onForward,
        onBack,
        globalData: value.data || {},
      }}
    >
      <DndContext
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onDragMove={onDragMove}
        sensors={sensors}
      >
        <Layout className={styles["lc-layout"]}>
          {pageSetting.menu && (
            <Layout.Sider
              width={pageSetting.menuWidth}
              className={classNames(
                styles["lc-container"],
                "p-0 important-mr-2"
              )}
            >
              <EditorMenu schema={value} onChange={onChange} />
            </Layout.Sider>
          )}
          <Layout.Content className={styles["lc-container"]}>
            <EditorContainer schema={value} onChange={onChange} />
          </Layout.Content>
        </Layout>
        {createPortal(
          <DragOverlay>
            {active ? (
              <div
                ref={(node) => {
                  if (node) {
                    dragOverlayRef.current = node.parentElement;
                  }
                }}
                className={classNames(styles["dragging-btn"], "cursor-move")}
              >
                {active}
              </div>
            ) : null}
          </DragOverlay>,
          document.body
        )}
      </DndContext>
    </EditorContext.Provider>
  );
};

Editor.Viewer = Viewer;

export default Editor;
