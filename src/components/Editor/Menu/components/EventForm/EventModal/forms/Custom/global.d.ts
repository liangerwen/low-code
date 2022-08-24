interface NavigateOptions {
  replace?: boolean;
  state?: any;
}
interface NavigateFunction {
  (to: string, options?: NavigateOptions): void;
  (delta: number): void;
}
type Params<Key extends string = string> = {
  readonly [key in Key]: string | undefined;
};
interface MessageConfig {
  content: string;
  showIcon?: boolean;
  position?: "top" | "bottom";
  duration?: number;
  closable?: boolean;
}
type MessageType = {
  normal: (config: string | MessageConfig) => void;
  info: (config: string | MessageConfig) => void;
  success: (config: string | MessageConfig) => void;
  warning: (config: string | MessageConfig) => void;
  error: (config: string | MessageConfig) => void;
  loading: (config: string | MessageConfig) => void;
};
interface NotifyConfig {
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
};
type ActionType = { id: string; name: string; form?: Record<string, any> };
type EventType = { isEvent: true; actions: ActionType[] };
type BindType = { isBind: true; name: string };
type IconType = { isIcon: true; name: string };
interface IComponent {
  id?: string;
  name: string;
  title?: string;
  props?: Record<string, any>;
  children?: (string | IconType | BindType | IComponent)[];
  container?: boolean;
  onlyContainer?: boolean;
  inline?: boolean;
}
interface ISchema {
  name: "page";
  inMenu: boolean;
  onLoad?: EventType;
  onDestroy?: EventType;
  onUpdate?: EventType;
  data?: Record<string, any>;
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
  schema: ISchema;
  forms: Record<string, IFormInstance>;
  navigate: NavigateFunction;
  params: Params<string>;
  data: Record<string, any>;
  setData: SetDataFunction;
}
interface IUtils {
  copy: (content: string) => void;
  download: (url: string) => void;
  message: MessageType;
  notify: NotifyType;
}
interface ICurrent {
  schema: IComponent | null;
  event: Event | null;
}

declare const current: DeepReadonly<ICurrent>;
declare const page: DeepReadonly<IPage>;
declare const utils: DeepReadonly<IUtils>;
