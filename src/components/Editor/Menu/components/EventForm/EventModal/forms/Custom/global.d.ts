interface NavigateOptions {
  replace?: boolean;
  state?: any;
}
interface NavigateFunction {
  (to: string, options?: NavigateOptions): void;
  (delta: number): void;
}
interface ReactRouterLocation {
  pathname: string;
  search: string;
  hash: string;
  state: any;
  key: string;
}
type Params<Key extends string = string> = {
  readonly [key in Key]: string | undefined;
};
type RemoveMessageFunction = () => void;
interface MessageConfig {
  content: string;
  showIcon?: boolean;
  position?: "top" | "bottom";
  duration?: number;
  closable?: boolean;
}
type MessageType = {
  normal: (config: string | MessageConfig) => RemoveMessageFunction;
  info: (config: string | MessageConfig) => RemoveMessageFunction;
  success: (config: string | MessageConfig) => RemoveMessageFunction;
  warning: (config: string | MessageConfig) => RemoveMessageFunction;
  error: (config: string | MessageConfig) => RemoveMessageFunction;
  loading: (config: string | MessageConfig) => RemoveMessageFunction;
  clear: () => void;
};
interface NotifyConfig {
  id?: string;
  title: string;
  content: string;
  showIcon?: boolean;
  position?: "topLeft" | "topRight" | "bottomLeft" | "bottomRight";
  duration?: number;
  closable?: boolean;
}
type NotifyType = {
  normal: (config: NotifyConfig) => void;
  info: (config: NotifyConfig) => void;
  success: (config: NotifyConfig) => void;
  warning: (config: NotifyConfig) => void;
  error: (config: NotifyConfig) => void;
  remove: (id: string) => void;
  clear: () => void;
};

type ActionType = {
  id: string;
  name: string;
  form?: Record<string, any>;
};
type EventType = {
  isEvent: true;
  actions: ActionType[];
};
type BindType = {
  isBind: true;
  name: string;
};
type IconType = {
  isIcon: true;
  name: string;
};
interface BaseComponent {
  name: string;
  props?: Record<string, any>;
  children?: (string | IconType | BindType | BaseComponent)[];
}
interface ContainerComponent {
  id: string;
  name: string;
  title: string;
  props?: Record<string, any>;
  children?: IComponent[];
  // inner: 需要额外的wrapper，divider和容器tip放在组件children里
  // outside: 需要额外的wrapper，divider和容器tip放在wrapper里
  // self: 不需要额外的wrapper，divider和容器tip放在组件children里
  container: "inner" | "outside" | "self";
  inline?: boolean;
}
interface NormalComponent {
  id: string;
  name: string;
  title: string;
  props?: Record<string, any>;
  children?: (string | IconType | BindType | BaseComponent)[];
  container?: false;
  inline?: boolean;
}
type IComponent = NormalComponent | ContainerComponent;
interface ISchema {
  name: "page";
  onLoad?: EventType;
  onDestroy?: EventType;
  onUpdate?: EventType;
  data?: Record<string, any>;
  css: string;
  body: IComponent[];
}

type FieldKeyType = string | number | symbol;
type ValidateFieldsErrors<
  FieldValue = any,
  FieldKey extends FieldKeyType = string
> = Record<FieldKey, FieldValue> | undefined | null;
interface FormValidateFn<
  FormData = any,
  FieldValue = FormData[keyof FormData],
  FieldKey extends FieldKeyType = keyof FormData
> {
  /**   * 验证所有表单的值，并且返回报错和表单数据   */ (): Promise<FormData>;
  /**   * 验证所有表单的值，并且返回报错和表单数据   * @param fields 需要校验的表单字段   */ (
    fields: FieldKey[]
  ): Promise<Partial<FormData>>;
  /**   * 验证所有表单的值，并且返回报错和表单数据   * @param callback 校验完成后的回调函数   */ (
    callback: (
      errors?: ValidateFieldsErrors<FieldValue, FieldKey>,
      values?: FormData
    ) => void
  ): void;
  /**   * 验证所有表单的值，并且返回报错和表单数据   * @param fields 需要校验的表单字段   * @param callback 校验完成后的回调函数   */ (
    fields: FieldKey[],
    callback: (
      errors?: ValidateFieldsErrors<FieldValue, FieldKey>,
      values?: Partial<FormData>
    ) => void
  ): void;
}
type FieldError<FieldValue = any> = {
  value?: FieldValue;
  message?: string;
  type?: string;
  requiredError?: boolean;
};
interface IFormInstance<
  FormData = any,
  FieldValue = FormData[keyof FormData],
  FieldKey extends FieldKeyType = keyof FormData
> {
  getTouchedFields: () => FieldKey[];
  setFieldValue: (field: FieldKey, value: FieldValue) => void;
  setFieldsValue: (values: DeepPartial<FormData>) => void;
  setFields: (obj: {
    [field in FieldKey]?: {
      value?: FieldValue;
      error?: FieldError<FieldValue>;
      touched?: boolean;
      warning?: string;
    };
  }) => void;
  getFieldValue: (field: FieldKey) => FieldValue;
  getFieldError: (field: FieldKey) => FieldError<FieldValue> | null;
  getFieldsError: (fields?: FieldKey[]) => {
    [key in FieldKey]?: FieldError<FieldValue>;
  };
  getFields: () => Partial<FormData>;
  getFieldsValue: (fields?: FieldKey[]) => Partial<FormData>;
  resetFields: (fieldKeys?: FieldKey | FieldKey[]) => void;
  validate: FormValidateFn<FormData, FieldValue, FieldKey>;
  submit: () => void;
  clearFields: (fieldKeys?: FieldKey | FieldKey[]) => void;
  scrollToField: (field: FieldKey, options?: ScrollIntoViewOptions) => void;
}
type SetDataCallback = (data: Record<string, any>) => void;
interface SetDataFunction {
  (produce: SetDataCallback, callback?: SetDataCallback): void;
  (data: Record<string, any>, callback?: SetDataCallback): void;
}
interface IPage {
  schema: ISchema; //当前页面的schema
  forms: Record<string, IFormInstance>; //当前页面所有的表单实例
  navigate: NavigateFunction; //路由跳转方法
  location: ReactRouterLocation; //react-router的Location对象
  params: Params<string>; //当前路由的params参数
  data: Record<string, any>; //当前页面的全局变量
  setData: SetDataFunction; //设置当前页面的全局变量
}
interface IUtils {
  copy: (content: string) => void; // 根据内容复制到剪切板
  download: (url: string) => void; // 根据链接下载内容
  message: MessageType; // 调用消息提醒
  notify: NotifyType; // 调用消息通知
}
interface ICurrent {
  schema: IComponent | null; // 当前组件的schema
  arguments: any[]; // 当前组件事件的参数
}

declare var current: DeepReadonly<ICurrent>;
declare var page: DeepReadonly<IPage>;
declare var utils: DeepReadonly<IUtils>;
