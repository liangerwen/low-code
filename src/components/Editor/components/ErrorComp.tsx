import { Alert, Button, Space } from "@arco-design/web-react";
import {
  IconExclamationCircle,
  IconLoading,
} from "@arco-design/web-react/icon";
import { useEffect, useRef } from "react";

export default ({ error, name = "", id, resetErrorBoundary }) => {
  const timer = useRef(null);

  useEffect(() => {
    timer.current = setInterval(() => {
      resetErrorBoundary?.();
    }, 3000);
    return () => clearInterval(timer.current);
  }, []);

  return (
    <>
      {error ? (
        <Alert
          type="error"
          title={`${name}组件内发生错误`}
          content={
            <>
              {id && <span>组件id: {id}</span>}
              <br />
              <span>错误信息: {error.message}</span>
              <br />
              <Space>
                <IconLoading />
                正在尝试重新加载...
              </Space>
            </>
          }
        />
      ) : (
        <Button
          type="dashed"
          status="danger"
          icon={<IconExclamationCircle />}
          className="pointer-events-none"
        >
          未找到组件
        </Button>
      )}
    </>
  );
};
