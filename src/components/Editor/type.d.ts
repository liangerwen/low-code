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

type PowerPartial<T> = {
  [U in keyof T]?: Partial<T[U]>;
};
