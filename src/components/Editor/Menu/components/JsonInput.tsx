import { useEffect, useMemo, useRef, useState } from "react";
import * as monaco from "monaco-editor";
import useMode, {
  getElementMode,
} from "@/components/Settings/ModeSetting/useMode";
import { ModeType } from "@/components/Settings";
import { Button, Modal } from "@arco-design/web-react";
import { IconClose } from "@arco-design/web-react/icon";
import { isEmpty } from "lodash";

interface IProps {
  value?: string;
  onChange?: (val: string) => void;
}

export default function ({ value = "", onChange }: IProps) {
  const instance = useRef<monaco.editor.IStandaloneCodeEditor>(null);
  const container = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  const { mode: ThemeMode } = useMode();
  const realMode = useMemo(() => getElementMode(), [ThemeMode]);

  useEffect(() => {
    if (instance.current && instance.current.getValue() !== value) {
      instance.current.setValue(value);
    }
  }, [value]);

  useEffect(() => {
    if (visible && container.current && !instance.current) {
      instance.current = monaco.editor.create(container.current, {
        value,
        language: "json",
        contextmenu: false,
        minimap: {
          enabled: false,
        },
        autoDetectHighContrast: false,
        wordWrap: "wordWrapColumn",
      });
    }
  }, [visible]);

  useEffect(() => {
    return () => {
      instance.current && instance.current.dispose();
    };
  }, []);

  useEffect(() => {
    monaco.editor.setTheme(realMode === ModeType.DARK ? "vs-dark" : "vs");
  }, [realMode]);

  return (
    <>
      <Button.Group>
        <Button onClick={() => setVisible(true)}>点击设置全局变量</Button>
        <Button icon={<IconClose />} onClick={() => onChange?.(undefined)} />
      </Button.Group>
      <Modal
        title="全局变量"
        style={{ width: 1200 }}
        simple={false}
        maskClosable={false}
        escToExit={false}
        visible={visible}
        mountOnEnter={false}
        onOk={() => {
          const makers = monaco.editor.getModelMarkers({});
          if (isEmpty(makers)) {
            onChange?.(instance.current.getValue());
            setVisible(false);
          }
        }}
        onCancel={() => setVisible(false)}
      >
        <div
          className="h-300px border-[rgb(var(--gray-3))] border-1"
          ref={container}
        />
      </Modal>
    </>
  );
}
