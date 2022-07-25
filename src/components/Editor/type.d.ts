// interface IComponent {
//   id?: string;
//   name: string;
//   title?: string;
//   props?: { [key: string]: any };
//   children?: (string | IComponent)[];
//   // icon的children
//   $$children?: { idx: number; value: { isIcon: true; name: string } }[];
//   container?: boolean;
//   inline?: boolean;
// }

type IEvent = {
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

type ISchema = IComponent[];
