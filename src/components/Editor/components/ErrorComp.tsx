import { Alert, Button } from "@arco-design/web-react";
import { IconExclamationCircle } from "@arco-design/web-react/icon";

export default ({ error, name = "", id }) => {
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
