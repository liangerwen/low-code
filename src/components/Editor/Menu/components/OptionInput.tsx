import { Input, InputProps, Button, Empty } from "@arco-design/web-react";
import {
  IconDragDotVertical,
  IconDelete,
  IconPlus,
} from "@arco-design/web-react/icon";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import classNames from "classnames";
import { CSS } from "@dnd-kit/utilities";
import {
  closestCenter,
  DndContext,
  MouseSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  restrictToParentElement,
  restrictToVerticalAxis,
} from "@dnd-kit/modifiers";
import { generate as uuid } from "shortid";
import { isEmpty } from "lodash";
import { produce } from "immer";

function OptionsInputItem<
  T extends { id: string | number; value: string; label: string }
>(props: {
  value: T;
  labelProps?: InputProps;
  valueProps?: InputProps;
  onDelete?: (value: T) => void;
  onChange?: (value: T) => void;
  className?: string;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: props.value.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      className={classNames(
        "flex p-2 rounded border-[rgb(var(--gray-3))] border-1 mb-2 relative bg-[var(--color-bg-2)] color-[var(--color-text-2)]",
        { "op-50": isDragging },
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
      <Input.Group>
        <Input
          className="w-[calc(50%-0.25rem)] mr-2"
          placeholder="标签"
          allowClear
          {...props.labelProps}
          value={props.value?.label}
          onChange={(label) => {
            props.onChange?.({ ...props.value, label: label });
          }}
        />
        <Input
          className="w-[calc(50%-0.25rem)]"
          placeholder="值"
          allowClear
          {...props.valueProps}
          value={props.value?.value}
          onChange={(value) => {
            props.onChange?.({ ...props.value, value: value });
          }}
        />
      </Input.Group>
      <Button
        className="ml-2"
        icon={<IconDelete />}
        status="danger"
        type="text"
        onClick={() => {
          props.onDelete?.(props.value);
        }}
      />
    </div>
  );
}

export default function OptionsInput<
  T extends { id: string | number; value: string; label: string }
>(props: { value?: T[]; onChange?: (val: T[]) => void }) {
  const { value = [], onChange } = props;
  const sensors = useSensors(useSensor(MouseSensor));

  return (
    <div className="w-full">
      {isEmpty(value) ? (
        <Empty />
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
          // 限制仅在父元素内垂直拖拽
          modifiers={[restrictToVerticalAxis, restrictToParentElement]}
        >
          <SortableContext
            items={value.map((v) => v.id)}
            strategy={verticalListSortingStrategy}
          >
            {value.map((v, idx) => (
              <OptionsInputItem
                key={v.id}
                value={v}
                onDelete={({ id }) => {
                  onChange?.(value.filter((i) => i.id !== id));
                }}
                onChange={(val) => {
                  onChange?.(
                    produce(value, (value) => {
                      value[idx] = val;
                    })
                  );
                }}
              />
            ))}
          </SortableContext>
        </DndContext>
      )}
      <Button
        icon={<IconPlus />}
        type="outline"
        long
        onClick={() => {
          onChange?.([...value, { label: "", value: "", id: uuid() } as T]);
        }}
      >
        增加一条选项
      </Button>
    </div>
  );

  function handleDragEnd(event) {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = value.findIndex((v) => v.id === active.id);
      const newIndex = value.findIndex((v) => v.id === over.id);
      onChange?.(arrayMove(value, oldIndex, newIndex));
    }
  }
}
