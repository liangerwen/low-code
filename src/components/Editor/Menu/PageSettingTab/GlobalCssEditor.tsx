import { useEffect, useRef, useState } from "react";
import { Button, Modal } from "@arco-design/web-react";
import { IconClose } from "@arco-design/web-react/icon";
import { isEmpty } from "lodash";
import CodeEditor, { CodeEditorInstance } from "@/components/CodeEditor";
import * as monaco from "monaco-editor";

interface IProps {
  value?: string;
  onChange?: (val: string) => void;
}

export default function ({ value = "", onChange }: IProps) {
  const instance = useRef<CodeEditorInstance>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (instance.current) {
      instance.current.setValue(value);
    }
  }, [value]);

  return (
    <>
      <Button.Group>
        <Button onClick={() => setVisible(true)}>点击设置全局样式</Button>
        <Button icon={<IconClose />} onClick={() => onChange?.(undefined)} />
      </Button.Group>
      <Modal
        title="全局样式"
        style={{ width: 1200 }}
        simple={false}
        maskClosable={false}
        escToExit={false}
        visible={visible}
        mountOnEnter={false}
        onOk={() => {
          const errors = instance.current?.getErrors();
          if (isEmpty(errors)) {
            instance.current?.formatCode().then(() => {
              onChange?.(instance.current.getValue());
              setVisible(false);
            });
          }
        }}
        onCancel={() => setVisible(false)}
      >
        <CodeEditor ref={instance} language="less" initialValue={value} />
      </Modal>
    </>
  );
}
