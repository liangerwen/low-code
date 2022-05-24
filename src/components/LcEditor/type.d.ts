interface IComponent {
  id?: string;
  name: string;
  type: React.FC<any>;
  props?: { [key: string]: any };
  children?: (string | IComponent)[];
  slots?: { [key: string]: any };
  container?: boolean;
  inline?: boolean;
}

type ISchema = IComponent[];
