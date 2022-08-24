import { Select } from "@arco-design/web-react";
import { ReactNode, useMemo } from "react";
import EventList from "./EventList";
import { produce } from "@/utils";

interface IProps {
  value?: Record<string, EventType>;
  onChange?: (val: Record<string, EventType>) => void;
  options: { label: ReactNode | string; value: string }[];
}

export default function (props: IProps) {
  const { options, value = {}, onChange } = props;

  const eventKeys = useMemo(() => Object.keys(value), [value]);
  const actionValue = useMemo(
    () =>
      Object.entries(value).reduce(
        (pre, cur) => ((pre[cur[0]] = cur[1].actions), pre),
        {}
      ),
    [value]
  );

  return (
    <>
      <Select
        mode="multiple"
        maxTagCount={2}
        placeholder="选择事件"
        allowClear
        options={options}
        value={eventKeys}
        onChange={(val) => {
          const newEvents = produce(value, (events) => {
            Object.keys(events).forEach((ek) => {
              if (val.indexOf(ek) === -1) {
                delete events[ek];
              }
            });
            val.forEach((v) => {
              if (!events[v]) {
                events[v] = { isEvent: true, actions: [] };
              }
            });
          });
          onChange?.(newEvents);
        }}
        className="mb-2"
      />
      <EventList
        value={actionValue}
        onChange={(value) => {
          onChange(
            Object.entries(value).reduce(
              (pre, cur) => (
                (pre[cur[0]] = { isEvent: true, actions: cur[1] }), pre
              ),
              {}
            )
          );
        }}
        options={options}
      />
    </>
  );
}
