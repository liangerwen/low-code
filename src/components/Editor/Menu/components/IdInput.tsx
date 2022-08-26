import { Button, Input, InputProps, Tooltip } from "@arco-design/web-react";
import { generate as uuid } from "shortid";

export default function (props: InputProps) {
  return (
    <Input.Group compact>
      <Input style={{ width: "calc(100% - 32px)" }} {...props} />
      <Tooltip content="随机生成">
        <Button
          icon={<i className="i-fe:random" />}
          onClick={(e) => {
            props.onChange?.(uuid(), e);
          }}
        ></Button>
      </Tooltip>
    </Input.Group>
  );
}
