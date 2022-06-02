interface IComponent {
  id?: string;
  name: string;
  title?: string;
  props?: { [key: string]: any };
  children?: (string | IComponent)[];
  slots?: { [key: string]: any };
  container?: boolean;
  inline?: boolean;
}

type ISchema = IComponent[];
