interface IComponent {
  id?: string;
  name: string;
  title?: string;
  props?: { [key: string]: any };
  children?: (string | IComponent)[];
  // icon的children
  $$children?: { idx: number; value: { isIcon: true; name: string } }[];
  slots?: { [key: string]: any };
  container?: boolean;
  inline?: boolean;
}

type ISchema = IComponent[];
