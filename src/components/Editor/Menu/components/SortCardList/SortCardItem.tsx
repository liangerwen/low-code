import { Tooltip, Space } from "@arco-design/web-react";
import Paragraph from "@arco-design/web-react/es/Typography/paragraph";
import {
  IconDragDotVertical,
  IconEdit,
  IconDelete,
} from "@arco-design/web-react/icon";
import { useSortable } from "@dnd-kit/sortable";
import classNames from "classnames";
import { ReactNode } from "react";
import { CSS } from "@dnd-kit/utilities";

export default function SortCardItem(props: {
  id: string | number;
  label: ReactNode | string;
  value: string | number;
  onDelete?: (id: string | number) => void;
  onEdit?: (id: string | number) => void;
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
