import {
  closestCenter,
  DndContext,
  DragOverlay,
  MouseSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  restrictToVerticalAxis,
  restrictToParentElement,
} from "@dnd-kit/modifiers";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { useState } from "react";
import { createPortal } from "react-dom";
import SortCardItem from "./SortCardItem";

export default function SortCardList<
  T extends { id: string | number; name: string }
>(props: {
  value: T[];
  onChange: (val: T[]) => void;
  onEdit: (val: T) => void;
  options: { label: string; value: string | number }[];
}) {
  const { value, options, onChange, onEdit } = props;
  const sensors = useSensors(useSensor(MouseSensor));

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
          const label = options.find((op) => op.value === v.name).label;
          return (
            <SortCardItem
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
            <SortCardItem
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
      label: options.find((op) => op.value === activeItem.name).label,
    });
  }
}
