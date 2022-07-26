import { produce } from "@/utils";
import {
  Collapse,
  Empty,
  Space,
  Tooltip,
  Typography,
} from "@arco-design/web-react";
import {
  IconDelete,
  IconDragDotVertical,
  IconEdit,
  IconPlus,
} from "@arco-design/web-react/icon";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import {
  restrictToVerticalAxis,
  restrictToParentElement,
} from "@dnd-kit/modifiers";
import { CSS } from "@dnd-kit/utilities";
import { ReactNode, useCallback, useMemo, useState } from "react";
import menuData from "./data";
import EventModal from "./EventModal";
import { createPortal } from "react-dom";
import classNames from "classnames";

const { Paragraph, Text } = Typography;

const eventOptions = menuData
  .map((i) => i.children)
  .flat()
  .map((i) => ({ label: i.title, value: i.key }));

function EventListItem(props: {
  id: string;
  label: ReactNode | string;
  value: string | number;
  onDelete?: (id: string) => void;
  onEdit?: (id: string) => void;
  className?: string;
  isDragOverlay?: boolean;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
    isSorting,
  } = useSortable({ id: props.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      className={classNames(
        "flex p-2 rounded border-[rgb(var(--gray-3))] border-1 mb-2 relative bg-[var(--color-bg-2)] color-[var(--color-text-2)]",
        { "op-20": isDragging },
        props.className
      )}
      style={style}
      {...attributes}
      ref={setNodeRef}
    >
      <div
        className="p-2 rounded box-border cursor-pointer hover-bg-[rgb(var(--gray-2))] mr-2 flex justify-center items-center"
        {...listeners}
      >
        <IconDragDotVertical />
      </div>
      <Tooltip content={props.id} disabled={isSorting || props.isDragOverlay}>
        <div>
          <Paragraph className="important-mb-0">{props.value}</Paragraph>
          <Paragraph className="important-mb-0 important-color-[rgb(var(--gray-5))]">
            {props.label}
          </Paragraph>
        </div>
      </Tooltip>
      <Space className="absolute right-2 top-2">
        <IconEdit
          className="cursor-pointer"
          onClick={() => {
            props?.onEdit(props.id);
          }}
        />
        <IconDelete
          className="cursor-pointer"
          onClick={() => {
            props?.onDelete(props.id);
          }}
        />
      </Space>
    </div>
  );
}

function EventList(props: {
  value: IEvent[];
  onChange: (val: IEvent[]) => void;
  onEdit: (val: IEvent) => void;
}) {
  const { value, onChange, onEdit } = props;
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const [active, setActive] = useState(null);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      // 限制仅在父元素内垂直拖拽
      modifiers={[restrictToVerticalAxis, restrictToParentElement]}
    >
      <SortableContext
        items={value.map((v) => v.id)}
        strategy={verticalListSortingStrategy}
      >
        {value.map((v) => {
          const label = eventOptions.find((op) => op.value === v.name).label;
          return (
            <EventListItem
              key={v.id}
              id={v.id}
              value={v.name}
              label={label}
              onDelete={(id) => {
                onChange(value.filter((v) => v.id !== id));
              }}
              onEdit={(id) => onEdit(value.find((v) => v.id === id))}
            />
          );
        })}
      </SortableContext>
      {createPortal(
        <DragOverlay>
          {active && (
            <EventListItem
              className="shadow-xl"
              {...active}
              isDragOverlay={true}
            />
          )}
        </DragOverlay>,
        document.body
      )}
    </DndContext>
  );

  function handleDragEnd(event) {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = value.findIndex((v) => v.id === active.id);
      const newIndex = value.findIndex((v) => v.id === over.id);
      onChange(arrayMove(value, oldIndex, newIndex));
    }
  }

  function handleDragStart({ active }) {
    if (!active) {
      return;
    }
    const activeItem = value.find((v) => v.id === active.id);
    setActive({
      id: activeItem.id,
      value: activeItem.name,
      label: eventOptions.find((op) => op.value === activeItem.name).label,
    });
  }
}

const enum ActionType {
  NONE,
  ADD,
  EDIT,
}

export default function EventCollapse({
  value,
  options,
  onChange,
}: {
  value: Record<string, IEvent[]>;
  options: { label: ReactNode | string; value: string }[];
  onChange?: (val: Record<string, IEvent[]>) => void;
}) {
  const [visible, setVisible] = useState(false);
  const [eventFormValue, setEventFormValue] = useState<IEvent | null>(null);
  const [actionType, setActionType] = useState<ActionType>(ActionType.NONE);
  const [eventType, setEventType] = useState<string>("");
  const eventKeys = useMemo(() => Object.keys(value), [value]);

  const onAdd = useCallback((et: string) => {
    setVisible(true);
    setEventFormValue(null);
    setActionType(ActionType.ADD);
    setEventType(et);
  }, []);

  const onEdit = useCallback((et: string, event: IEvent) => {
    setVisible(true);
    setEventFormValue(event);
    setActionType(ActionType.EDIT);
    setEventType(et);
  }, []);

  const onCalcel = useCallback(() => {
    setVisible(false);
    setEventFormValue(null);
    setActionType(ActionType.NONE);
    setEventType("");
  }, []);

  return (
    <>
      {eventKeys.length > 0 && (
        <Collapse>
          {eventKeys.map((et) => {
            const label = options.find((op) => op.value === et)?.label;
            return (
              <Collapse.Item
                header={
                  <Text className="important-text-sm important-color-[var(--color-text-2)]">
                    {label}
                  </Text>
                }
                name={et}
                key={et}
                extra={
                  <Space>
                    <IconPlus onClick={() => onAdd(et)} />
                    <IconDelete
                      onClick={() => {
                        onChange?.(
                          produce(value, (events) => {
                            delete events[et];
                          })
                        );
                      }}
                    />
                  </Space>
                }
              >
                {value[et] && value[et].length > 0 ? (
                  <EventList
                    value={value[et] || []}
                    onChange={(val) => {
                      onChange?.({ ...value, [et]: val });
                    }}
                    onEdit={(e) => onEdit(et, e)}
                  />
                ) : (
                  <Empty className="select-none" />
                )}
              </Collapse.Item>
            );
          })}
        </Collapse>
      )}
      <EventModal
        visible={visible}
        onOk={(event) => {
          let newEvents;
          if (actionType === ActionType.ADD) {
            newEvents = produce(value, (events) => {
              events[eventType] = [...(events[eventType] || []), event];
            });
          } else if (actionType === ActionType.EDIT) {
            newEvents = produce(value, (events) => {
              const changeEvent = events[eventType];
              const changIdx = changeEvent.findIndex(
                (ce) => ce.name === eventFormValue.name
              );
              changeEvent.splice(changIdx, 1, event);
            });
          }
          onChange?.(newEvents);
          onCalcel();
        }}
        initialValues={eventFormValue}
        onCancel={onCalcel}
      />
    </>
  );
}
