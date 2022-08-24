import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
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
import { Switch } from "@arco-design/web-react";

const baseType =
  "type DeepPartial<T> = T extends object ? {\n  [P in keyof T]?: DeepPartial<T[P]>;\n} : T;type Primitive = undefined | null | boolean | string | number | Function;\ntype DeepReadonly<T> = T extends Primitive ? T : T extends Array<infer U> ? DeepReadonlyArray<U> : T extends Map<infer K, infer V> ? DeepReadonlyMap<K, V> : DeepReadonlyObject<T>;\ninterface DeepReadonlyArray<T> extends ReadonlyArray<DeepReadonly<T>> {};\ninterface DeepReadonlyMap<K, V> extends ReadonlyMap<DeepReadonly<K>, DeepReadonly<V>> {};\ntype DeepReadonlyObject<T> = {\n  readonly [K in keyof T]: DeepReadonly<T[K]>\n};\n";

const globalType =
  'interface NavigateOptions {\n  replace?: boolean;\n  state?: any;\n}\ninterface NavigateFunction {\n  (to: string, options?: NavigateOptions): void;\n  (delta: number): void;\n}\ntype Params<Key extends string = string> = {\n  readonly [key in Key]: string | undefined;\n};\ninterface MessageConfig {\n  content: string;\n  showIcon?: boolean;\n  position?: "top" | "bottom";\n  duration?: number;\n  closable?: boolean;\n}\ntype MessageType = {\n  normal: (config: string | MessageConfig) => void;\n  info: (config: string | MessageConfig) => void;\n  success: (config: string | MessageConfig) => void;\n  warning: (config: string | MessageConfig) => void;\n  error: (config: string | MessageConfig) => void;\n  loading: (config: string | MessageConfig) => void;\n};\ninterface NotifyConfig {\n  title: string;\n  content: string;\n  showIcon?: boolean;\n  position?: "topLeft" | "topRight" | "bottomLeft" | "bottomRight";\n  duration?: number;\n  closable?: boolean;\n}\ntype NotifyType = {\n  normal: (config: NotifyConfig) => void;\n  info: (config: NotifyConfig) => void;\n  success: (config: NotifyConfig) => void;\n  warning: (config: NotifyConfig) => void;\n  error: (config: NotifyConfig) => void;\n};\ntype ActionType = {\n  id: string;\n  name: string;\n  form?: Record<string, any>;\n};\ntype EventType = {\n  isEvent: true;\n  actions: ActionType[];\n};\ntype BindType = {\n  isBind: true;\n  name: string;\n};\ntype IconType = {\n  isIcon: true;\n  name: string;\n};\ninterface IComponent {\n  id?: string;\n  name: string;\n  title?: string;\n  props?: Record<string, any>;\n  children?: (string | IconType | BindType | IComponent)[];\n  container?: boolean;\n  onlyContainer?: boolean;\n  inline?: boolean;\n}\ninterface ISchema {\n  name: "page";\n  inMenu: boolean;\n  onLoad?: EventType;\n  onDestroy?: EventType;\n  onUpdate?: EventType;\n  data?: Record<string, any>;\n  body: IComponent[];\n}\ntype FieldKeyType = string | number | symbol;\ntype ValidateFieldsErrors<\n  FieldValue = any,\n  FieldKey extends FieldKeyType = string\n> = Record<FieldKey, FieldValue> | undefined | null;\ninterface FormValidateFn<\n  FormData = any,\n  FieldValue = FormData[keyof FormData],\n  FieldKey extends FieldKeyType = keyof FormData\n> {\n  /**\n   * 验证所有表单的值，并且返回报错和表单数据\n   */\n  (): Promise<FormData>;\n  /**\n   * 验证所有表单的值，并且返回报错和表单数据\n   * @param fields 需要校验的表单字段\n   */\n  (fields: FieldKey[]): Promise<Partial<FormData>>;\n  /**\n   * 验证所有表单的值，并且返回报错和表单数据\n   * @param callback 校验完成后的回调函数\n   */\n  (\n    callback: (\n      errors?: ValidateFieldsErrors<FieldValue, FieldKey>,\n      values?: FormData\n    ) => void\n  ): void;\n  /**\n   * 验证所有表单的值，并且返回报错和表单数据\n   * @param fields 需要校验的表单字段\n   * @param callback 校验完成后的回调函数\n   */\n  (\n    fields: FieldKey[],\n    callback: (\n      errors?: ValidateFieldsErrors<FieldValue, FieldKey>,\n      values?: Partial<FormData>\n    ) => void\n  ): void;\n}\ntype FieldError<FieldValue = any> = {\n  value?: FieldValue;\n  message?: string;\n  type?: string;\n  requiredError?: boolean;\n};\ninterface IFormInstance<\n  FormData = any,\n  FieldValue = FormData[keyof FormData],\n  FieldKey extends FieldKeyType = keyof FormData\n> {\n  getTouchedFields: () => FieldKey[];\n  setFieldValue: (field: FieldKey, value: FieldValue) => void;\n  setFieldsValue: (values: DeepPartial<FormData>) => void;\n  setFields: (obj: {\n    [field in FieldKey]?: {\n      value?: FieldValue;\n      error?: FieldError<FieldValue>;\n      touched?: boolean;\n      warning?: string;\n    };\n  }) => void;\n  getFieldValue: (field: FieldKey) => FieldValue;\n  getFieldError: (field: FieldKey) => FieldError<FieldValue> | null;\n  getFieldsError: (fields?: FieldKey[]) => {\n    [key in FieldKey]?: FieldError<FieldValue>;\n  };\n  getFields: () => Partial<FormData>;\n  getFieldsValue: (fields?: FieldKey[]) => Partial<FormData>;\n  resetFields: (fieldKeys?: FieldKey | FieldKey[]) => void;\n  validate: FormValidateFn<FormData, FieldValue, FieldKey>;\n  submit: () => void;\n  clearFields: (fieldKeys?: FieldKey | FieldKey[]) => void;\n  scrollToField: (field: FieldKey, options?: ScrollIntoViewOptions) => void;\n}\ntype SetDataCallback = (data: Record<string, any>) => void;\ninterface SetDataFunction {\n  (data: Record<string, any>, callback?: SetDataCallback): void;\n  (produce: SetDataCallback, callback?: SetDataCallback): void;\n}\ninterface IPage {\n  schema: ISchema;\n  forms: Record<string, IFormInstance>;\n  navigate: NavigateFunction;\n  params: Params<string>;\n  data: Record<string, any>;\n  setData: SetDataFunction;\n}\ninterface IUtils {\n  copy: (content: string) => void;\n  download: (url: string) => void;\n  message: MessageType;\n  notify: NotifyType;\n}\ninterface ICurrent {\n  schema: IComponent | null;\n  event: Event | null;\n}\n\ndeclare const current: DeepReadonly<ICurrent>;\ndeclare const page: DeepReadonly<IPage>;\ndeclare const utils: DeepReadonly<IUtils>;';

const CustomForm = forwardRef<FormRefType, FormPropsType<CustomFormType>>(
  function ({ value = { content: "" } }, ref) {
    const instance = useRef<monaco.editor.IStandaloneCodeEditor>(null);
    const container = useRef<HTMLDivElement>(null);
    const [visible, setVisible] = useState(true);

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
        language: "javascript",
        contextmenu: false,
        minimap: {
          enabled: false,
        },
        autoDetectHighContrast: false,
        wordWrap: "wordWrapColumn",
      });
      const addExtralib =
        monaco.languages.typescript.javascriptDefaults.addExtraLib(
          baseType + globalType,
          "lowcode.d.ts"
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
            是否显示类型：
            <Switch
              size="small"
              checked={visible}
              onChange={(v) => setVisible(v)}
            />
            <br />
            {visible && (
              <SyntaxHighlighter
                language="typescript"
                style={realMode === ModeType.LGIHT ? light : dark}
                wrapLines={true}
                className="codeview"
              >
                {`/** =======全局对象current, page, utils类型======= **/\n\n${globalType}`}
              </SyntaxHighlighter>
            )}
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
