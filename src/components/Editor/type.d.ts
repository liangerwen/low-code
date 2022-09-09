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
  css?: string;
  body: IComponent[];
}
