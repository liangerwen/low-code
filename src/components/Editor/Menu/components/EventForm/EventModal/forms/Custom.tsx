import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
} from "react";
import * as monaco from "monaco-editor";
import EventContentWarp from "../EventContentWarp";
import MENUKEYS from "../../keys";
import { CustomFormType, FormPropsType, FormRefType } from "../../types";
import useMode, {
  getElementMode,
} from "@/components/Settings/ModeSetting/useMode";
import { ModeType } from "@/components/Settings";
import { isEmpty } from "lodash";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import dark from "react-syntax-highlighter/dist/esm/styles/prism/duotone-dark";
import light from "react-syntax-highlighter/dist/esm/styles/prism/duotone-light";

const baseType =
  "type Primitive = undefined | null | boolean | string | number | Function;\ntype DeepReadonly<T> = T extends Primitive ? T : T extends Array<infer U> ? DeepReadonlyArray<U> : T extends Map<infer K, infer V> ? DeepReadonlyMap<K, V> : DeepReadonlyObject<T>;\ninterface DeepReadonlyArray<T> extends ReadonlyArray<DeepReadonly<T>> {};\ninterface DeepReadonlyMap<K, V> extends ReadonlyMap<DeepReadonly<K>, DeepReadonly<V>> {};\ntype DeepReadonlyObject<T> = {\n  readonly [K in keyof T]: DeepReadonly<T[K]>\n};";

const globalType =
  'interface NavigateOptions {\n  replace?: boolean;\n  state?: any;\n}\ninterface NavigateFunction {\n  (to: string, options?: NavigateOptions): void;\n  (delta: number): void;\n}\ntype Params<Key extends string = string> = {\n  readonly [key in Key]: string | undefined;\n};\ninterface MessageConfig {\n  content: string;\n  showIcon?: boolean;\n  position?: "top" | "bottom";\n  duration?: number;\n  closable?: boolean;\n}\ntype MessageType = {\n  normal: (config: string | MessageConfig) => void;\n  info: (config: string | MessageConfig) => void;\n  success: (config: string | MessageConfig) => void;\n  warning: (config: string | MessageConfig) => void;\n  error: (config: string | MessageConfig) => void;\n  loading: (config: string | MessageConfig) => void;\n};\ninterface NotifyConfig {\n  title: string;\n  content: string;\n  showIcon?: boolean;\n  position?: "topLeft" | "topRight" | "bottomLeft" | "bottomRight";\n  duration?: number;\n  closable?: boolean;\n}\ntype NotifyType = {\n  normal: (config: NotifyConfig) => void;\n  info: (config: NotifyConfig) => void;\n  success: (config: NotifyConfig) => void;\n  warning: (config: NotifyConfig) => void;\n  error: (config: NotifyConfig) => void;\n};\ntype ActionType = {\n  id: string;\n  name: string;\n  form?: Record<string, any>;\n};\n\ntype EventType = {\n  isEvent: true;\n  actions: ActionType[];\n};\ntype BindType = {\n  isBind: true;\n  name: string;\n};\n\ntype IconType = {\n  isIcon: true;\n  name: string;\n};\ninterface IComponent {\n  id?: string;\n  name: string;\n  title?: string;\n  props?: Record<string, any>;\n  children?: (string | IconType | BindType | IComponent)[];\n  container?: boolean;\n  onlyContainer?: boolean;\n  inline?: boolean;\n}\ninterface ISchema {\n  name: "page";\n  inMenu: boolean;\n  onLoad?: EventType;\n  onDestroy?: EventType;\n  onUpdate?: EventType;\n  data?: Record<string, any>;\n  body: IComponent[];\n}\ninterface IPage {\n  schema: ISchema;\n  navigate: NavigateFunction;\n  params: Params<string>;\n}\ninterface IUtils {\n  copy: (content: string) => void;\n  download: (url: string) => void;\n  message: MessageType;\n  notify: NotifyType;\n}\ninterface ICurrent {\n  schema: IComponent | null;\n  event: Event | null;\n}\n\ndeclare const current: DeepReadonly<ICurrent>;\ndeclare const page: DeepReadonly<IPage>;\ndeclare const utils: DeepReadonly<IUtils>;\n';

const CustomForm = forwardRef<FormRefType, FormPropsType<CustomFormType>>(
  function ({ value = { content: "" } }, ref) {
    const instance = useRef<monaco.editor.IStandaloneCodeEditor>(null);
    const container = useRef<HTMLDivElement>(null);

    const { mode: ThemeMode } = useMode();
    const realMode = useMemo(() => getElementMode(), [ThemeMode]);

    useImperativeHandle(ref, () => ({
      validate: () => {
        return new Promise((resolve, reject) => {
          const makers = monaco.editor.getModelMarkers({});
          if (isEmpty(makers)) {
            resolve({ content: instance.current?.getValue() });
          } else {
            reject(makers);
          }
        });
      },
    }));

    useEffect(() => {
      if (instance.current) {
        instance.current.setValue(value.content);
      }
    }, [value.content]);

    useEffect(() => {
      instance.current = monaco.editor.create(container.current, {
        value: value.content,
        language: "typescript",
        contextmenu: false,
        minimap: {
          enabled: false,
        },
        autoDetectHighContrast: false,
        wordWrap: "wordWrapColumn",
      });
      const addExtralib =
        monaco.languages.typescript.typescriptDefaults.addExtraLib(
          baseType + globalType,
          "global.d.ts"
        );
      const documentFormattingEditProvider =
        monaco.languages.registerDocumentFormattingEditProvider("javascript", {
          async provideDocumentFormattingEdits(model) {
            const prettier = await import("prettier/standalone");
            const babel = await import("prettier/parser-babel");
            const text = prettier.format(model.getValue(), {
              parser: "babel",
              plugins: [babel],
              singleQuote: true,
              tabWidth: 2,
            });
            return [
              {
                range: model.getFullModelRange(),
                text,
              },
            ];
          },
        });
      return () => {
        addExtralib.dispose();
        documentFormattingEditProvider.dispose();
        instance.current && instance.current.dispose();
      };
    }, []);

    useEffect(() => {
      monaco.editor.setTheme(realMode === ModeType.DARK ? "vs-dark" : "vs");
    }, [realMode]);

    return (
      <EventContentWarp
        desc={
          <>
            通过JavaScript自定义动作逻辑
            <br />
            自定义JS使用说明：
            <br />
            <SyntaxHighlighter
              language="typescript"
              style={realMode === ModeType.LGIHT ? light : dark}
              wrapLines={true}
              className="codeview"
            >
              {`/** =======全局对象current, nativeEvent, page, utils类型======= **/\n\n${globalType}`}
            </SyntaxHighlighter>
          </>
        }
      >
        <div
          className="h-300px border-[rgb(var(--gray-3))] border-1"
          ref={container}
        />
      </EventContentWarp>
    );
  }
);

export default {
  name: MENUKEYS.CUSTOM,
  Form: CustomForm,
};
