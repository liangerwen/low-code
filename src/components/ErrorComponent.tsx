import { Alert, Button } from "@arco-design/web-react";
import { IconRefresh } from "@arco-design/web-react/icon";
import { Fragment, useMemo } from "react";

export default function ErrorComponent({ error }) {
  const msg = useMemo(() => error.stack.split("\n"), [error]);
  return (
    <div className="w-[100vw] h-[100vh] overflow-hidden bg-[rgb(var(--gray-2))]">
      <div className="w-800px flex flex-col justify-center shadow-[rgba(0,0,0,0.08)] shadow p-2 bg-[var(--color-bg-2)] border border-[var(--color-border)] rounded mt-[100px] mx-auto">
        <Alert
          type="error"
          title="页面崩溃了"
          content={
            <>
              <span>错误信息：</span>
              <br />
              <span className="text-xs color-[var(--color-text-3)]">
                {msg.map((i, idx) => (
                  <Fragment key={idx}>
                    <i>{i}</i>
                    {idx < msg.length - 1 && <br />}
                    &nbsp;&nbsp;&nbsp;&nbsp;
                  </Fragment>
                ))}
              </span>
            </>
          }
        />
        <Button
          className="mt-2"
          onClick={() => {
            window.location.reload();
          }}
          icon={<IconRefresh />}
        >
          重 试
        </Button>
      </div>
    </div>
  );
}
