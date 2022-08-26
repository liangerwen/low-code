import { produce } from "@/utils";
import { Collapse, Empty, Space, Typography } from "@arco-design/web-react";
import { IconDelete, IconPlus } from "@arco-design/web-react/icon";
import { ReactNode, useCallback, useMemo, useState } from "react";
import menus from "./menus";
import EventModal from "./EventModal";
import SortCardList from "../SortCardList";

const { Text } = Typography;

const eventOptions = menus
  .map((i) => i.children)
  .flat()
  .map((i) => ({ label: i.title, value: i.key }));

const enum HandleType {
  NONE,
  ADD,
  EDIT,
}

export default function EventCollapse({
  value,
  options,
  onChange,
}: {
  value: Record<string, ActionType[]>;
  options: { label: ReactNode | string; value: string }[];
  onChange?: (val: Record<string, ActionType[]>) => void;
}) {
  const [visible, setVisible] = useState(false);
  const [eventFormValue, setEventFormValue] = useState<ActionType | null>(null);
  const [handleType, setHandleType] = useState<HandleType>(HandleType.NONE);
  const [eventType, setEventType] = useState<string>("");
  const eventKeys = useMemo(() => Object.keys(value), [value]);

  const onAdd = useCallback((et: string) => {
    setVisible(true);
    setEventFormValue(null);
    setHandleType(HandleType.ADD);
    setEventType(et);
  }, []);

  const onEdit = useCallback((et: string, event: ActionType) => {
    setVisible(true);
    setEventFormValue(event);
    setHandleType(HandleType.EDIT);
    setEventType(et);
  }, []);

  const onCalcel = useCallback(() => {
    setVisible(false);
    setEventFormValue(null);
    setHandleType(HandleType.NONE);
    setEventType("");
  }, []);

  return (
    <>
      {eventKeys.length > 0 && (
        <Collapse defaultActiveKey={eventKeys}>
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
                  <SortCardList
                    value={value[et] || []}
                    onChange={(val) => {
                      onChange?.({ ...value, [et]: val });
                    }}
                    onEdit={(e) => onEdit(et, e)}
                    options={eventOptions}
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
          if (handleType === HandleType.ADD) {
            newEvents = produce(value, (events) => {
              events[eventType] = [...(events[eventType] || []), event];
            });
          } else if (handleType === HandleType.EDIT) {
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
