type IEvent = {
  id: string;
  name: string;
  form?: Record<string, any>;
};

type IconType = {
  isIcon: true;
  name: string;
};

interface IComponent {
  id?: string;
  name: string;
  title?: string;
  attrs?: Record<string, any>;
  events?: Record<string, IEvent[]>;
  children?: (string | IconType | IComponent)[];
  container?: boolean;
  inline?: boolean;
}

interface ISchema {
  name: "page";
  inMenu: boolean;
  onLoad?: IEvent[];
  onDestroy?: IEvent[];
  onUpdate?: IEvent[];
  data?: Record<string, any>;
  body: IComponent[];
}
