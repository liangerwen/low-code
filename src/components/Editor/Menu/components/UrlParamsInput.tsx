import { produce } from "@/utils";
import { Button, Empty, Grid, Input, InputProps } from "@arco-design/web-react";
import { IconDelete, IconPlus } from "@arco-design/web-react/icon";

const { Row } = Grid;

interface IProps {
  value?: { key: string; value: string }[];
  onChange?: (value: { key: string; value: string }[]) => void;
  keyProps?: InputProps;
  valueProps?: InputProps;
}

export default function UrlParamsInput({
  value = [],
  onChange,
  keyProps,
  valueProps,
}: IProps) {
  return (
    <>
      {value.length === 0 ? (
        <Empty />
      ) : (
        value.map((p, idx) => (
          <Row key={idx} gutter={8} className="mb-2">
            <div className="flex-1 mr-2">
              <Input.Group>
                <Input
                  className="w-1/4 mr-2"
                  placeholder="参数名"
                  allowClear
                  {...keyProps}
                  value={p.key}
                  onChange={(key) => {
                    onChange?.(
                      produce(value, (value) => {
                        value[idx].key = key;
                      })
                    );
                  }}
                />
                <Input
                  className="w-[calc(75%-0.5rem)]"
                  placeholder="参数值"
                  allowClear
                  {...valueProps}
                  value={p.value}
                  onChange={(val) => {
                    onChange?.(
                      produce(value, (value) => {
                        value[idx].value = val;
                      })
                    );
                  }}
                />
              </Input.Group>
            </div>
            <Button
              icon={<IconDelete />}
              status="danger"
              type="text"
              onClick={() => {
                onChange?.(
                  produce(value, (value) => {
                    value.splice(idx, 1);
                  })
                );
              }}
            />
          </Row>
        ))
      )}
      <Row>
        <Button
          type="outline"
          long
          icon={<IconPlus />}
          onClick={() => {
            onChange?.([...value, { key: "", value: "" }]);
          }}
        >
          加一条数据
        </Button>
      </Row>
    </>
  );
}
