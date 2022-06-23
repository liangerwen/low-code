import { Button } from "@arco-design/web-react";
import { IconExclamationCircle } from "@arco-design/web-react/icon";

export default () => {
  return (
    <Button
      type="dashed"
      status="danger"
      icon={<IconExclamationCircle />}
      className="pointer-events-none"
    >
      没有此组件
    </Button>
  );
};
