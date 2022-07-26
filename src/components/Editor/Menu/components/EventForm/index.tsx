import { Select } from "@arco-design/web-react";
import { ReactNode, useMemo } from "react";
import EventList from "./EventList";
import { produce } from "@/utils";

interface IProps {
  value?: Record<string, IEvent[]>;
  onChange?: (val: Record<string, IEvent[]>) => void;
  options: { label: ReactNode | string; value: string }[];
}

export default function (props: IProps) {
  const { options, value = {}, onChange } = props;

  const eventKeys = useMemo(() => Object.keys(value), [value]);

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
                events[v] = [];
              }
            });
          });
          onChange?.(newEvents);
        }}
        className="mb-2"
      />
      <EventList value={value} onChange={onChange} options={options} />
    </>
  );
}
