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

interface IComponent {
  id?: string;
  name: string;
  title?: string;
  props?: Record<string, any>;
  children?: (string | IconType | BindType | IComponent)[];
  // inner: 需要额外的wrapper，divider和容器tip放在组件children里
  // outside: 需要额外的wrapper，divider和容器tip放在wrapper里
  // self: 不需要额外的wrapper，divider和容器tip放在组件children里
  container?: "inner" | "outside" | "self";
  inline?: boolean;
}

interface ISchema {
  name: "page";
  onLoad?: EventType;
  onDestroy?: EventType;
  onUpdate?: EventType;
  data?: Record<string, any>;
  body: IComponent[];
}

type PowerPartial<T> = {
  [U in keyof T]?: Partial<T[U]>;
};
