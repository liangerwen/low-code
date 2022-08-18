import * as monaco from "monaco-editor";
import { generate as uuid } from "shortid";
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import useMode, { getElementMode } from "../Settings/ModeSetting/useMode";
import { ModeType } from "../Settings";

interface IProps {
  id?: string;
  className?: string;
  language?: "javascript" | "typescript";
  defaultValue?: string;
}

function JsCodeEditor(props: IProps, ref) {
  const instance = useRef<monaco.editor.IStandaloneCodeEditor>(null);
  const [ready, setReady] = useState(false);
  const {
    id = uuid(),
    className,
    language = "javascript",
    defaultValue = "",
  } = props;
  const { mode: ThemeMode } = useMode();

  const realMode = useMemo(() => getElementMode(), [ThemeMode]);

  useEffect(() => {
    if (instance.current) {
      const val = instance.current.getValue();
      instance.current.getModel()?.dispose();
      instance.current.setModel(monaco.editor.createModel(val, language));
      instance.current.setValue(val);
    }
  }, [language]);

  useEffect(() => {
    if (instance.current) {
      instance.current.setValue(defaultValue);
    }
  }, [defaultValue]);

  useEffect(() => {
    instance.current = monaco.editor.create(
      document.getElementById(`monaco-editor-ser-${id}`),
      {
        model: monaco.editor.createModel(defaultValue, language),
        //右击菜单
        contextmenu: false,
        //代码缩略图
        minimap: {
          enabled: false,
        },
        autoDetectHighContrast: false,
      }
    );
    setReady(true);
    return () => instance.current && instance.current.dispose();
  }, []);

  useEffect(() => {
    monaco.editor.setTheme(realMode === ModeType.DARK ? "vs-dark" : "vs");
  }, [realMode]);

  useImperativeHandle(ref, () => instance.current, [ready]);

  return <div id={`monaco-editor-ser-${id}`} className={className} />;
}

export default forwardRef<monaco.editor.IStandaloneCodeEditor, IProps>(
  JsCodeEditor
);
