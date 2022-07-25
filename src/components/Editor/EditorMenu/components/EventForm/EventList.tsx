import { updateObject } from "@/utils";
import { Collapse, Empty, Space, Typography } from "@arco-design/web-react";
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
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ReactNode, useCallback, useMemo, useState } from "react";
import menuData from "./data";
import EventModal from "./EventModal";

const { Paragraph, Text } = Typography;

const eventOptions = menuData
  .map((i) => i.children)
  .flat()
  .map((i) => ({ label: i.title, value: i.key }));

function EventListItem(props: {
  label: ReactNode | string;
  value: string | number;
  onDelete: (val: string | number) => void;
  onEdit: (val: string | number) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: props.value });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      className="flex p-2 rounded border-[rgb(var(--gray-3))] border-1 mb-2 relative"
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
      <div>
        <Paragraph className="important-mb-0">{props.value}</Paragraph>
        <Paragraph className="important-mb-0 important-color-[rgb(var(--gray-5))]">
          {props.label}
        </Paragraph>
      </div>
      <Space className="absolute right-2 top-2">
        <IconEdit
          className="cursor-pointer"
          onClick={() => {
            props.onEdit(props.value);
          }}
        />
        <IconDelete
          className="cursor-pointer"
          onClick={() => {
            props.onDelete(props.value);
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

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={value.map((v) => v.name)}
        strategy={verticalListSortingStrategy}
      >
        {value.map((v) => {
          const label = eventOptions.find((op) => op.value === v.name).label;
          return (
            <EventListItem
              key={v.name}
              value={v.name}
              label={label}
              onDelete={(val) => {
                onChange(value.filter((v) => v.name !== val));
              }}
              onEdit={(val) => onEdit(value.find((v) => v.name !== val))}
            />
          );
        })}
      </SortableContext>
    </DndContext>
  );

  function handleDragEnd(event) {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = value.findIndex((v) => v.name === active.id);
      const newIndex = value.findIndex((v) => v.name === over.id);
      onChange(arrayMove(value, oldIndex, newIndex));
    }
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
                          updateObject(value, (events) => {
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
            newEvents = updateObject(value, (events) => {
              events[eventType] = [...(events[eventType] || []), event];
            });
          } else if (actionType === ActionType.EDIT) {
            newEvents = updateObject(value, (events) => {
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
