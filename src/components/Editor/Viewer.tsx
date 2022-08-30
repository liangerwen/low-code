import useSyncState from "@/hooks/useSyncState";
import { FormInstance } from "@arco-design/web-react";
import { noop } from "lodash";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
} from "react";
import { ErrorBoundary } from "react-error-boundary";
import {
  NavigateFunction,
  Params,
  useNavigate,
  useParams,
} from "react-router-dom";
import { render } from "less";
import ErrorComp from "./components/ErrorComp";
import ProFormProvider from "./Menu/components/ProFormProvider";
import { getComponentByName } from "./Menu/ComponentsTab/data";
import { doActions } from "./utils/events";
import { parseChildrenForViewer, parsePropsForViewer } from "./utils/parse";

interface ItemProps {
  item: IComponent;
}

const ViewerContext = createContext<{
  navigate: NavigateFunction;
  params: Params<string>;
  current: IComponent | null;
  schema: ISchema;
  forms: Record<string, FormInstance>;
  data: Record<string, any>;
  setData: (data: Record<string, any>) => void;
}>({
  navigate: noop,
  params: {},
  current: null,
  schema: null,
  forms: {},
  data: {},
  setData: noop,
});

function ViewerCommonItem({ item, ...rest }) {
  const { id, name, props: p = {}, children } = item as IComponent;

  const options = useContext(ViewerContext);
  const itemOptions = useMemo(
    () => ({ ...options, current: item }),
    [options, item]
  );

  const Common = getComponentByName(name);
  const commonProps = useMemo(
    () => parsePropsForViewer(p, itemOptions),
    [p, itemOptions]
  );
  const commonChildren = useMemo(
    () =>
      parseChildrenForViewer(children, {
        render: (child, idx) => <ViewerCommonItem item={child} key={idx} />,
        data: options.data,
      }),
    [children, options.data]
  );
  return (
    <ErrorBoundary
      fallbackRender={(args) => <ErrorComp {...args} name={name} id={id} />}
    >
      <Common {...commonProps} {...rest}>
        {commonChildren}
      </Common>
    </ErrorBoundary>
  );
}

const ViewerItem = (props: ItemProps) => {
  const { item, ...rest } = props;
  const { id, container, name, props: p = {}, children } = item;

  const options = useContext(ViewerContext);
  const itemOptions = useMemo(
    () => ({ ...options, current: item }),
    [options, item]
  );

  const Comp = getComponentByName(name);
  const CompProps = useMemo(
    () => parsePropsForViewer(p, itemOptions),
    [p, itemOptions]
  );

  const renderChildren = useCallback(() => {
    const Item = container ? ViewerItem : ViewerCommonItem;
    return parseChildrenForViewer(children, {
      render: (child, idx) => <Item item={child} key={idx} />,
      data: options.data,
    });
  }, [children, container]);

  return (
    <ErrorBoundary
      fallbackRender={(args) => <ErrorComp {...args} name={name} id={id} />}
    >
      <Comp {...CompProps} {...rest}>
        {renderChildren()}
      </Comp>
    </ErrorBoundary>
  );
};

export interface IProps {
  schema: ISchema;
}

export default function EditorViewer(props: IProps) {
  const { schema } = props;
  const { onDestroy, onLoad, onUpdate, data = {}, css = "" } = schema;

  const formRef = useRef({});

  const [pageData, setPageData] = useSyncState(data);

  const navigate = useNavigate();
  const params = useParams();

  const options = useMemo(
    () => ({
      navigate,
      params,
      schema,
      current: null,
      forms: formRef.current,
      data: pageData,
      setData: setPageData,
    }),
    [schema, pageData, setPageData]
  );

  useEffect(() => {
    if (onLoad) {
      doActions(onLoad.actions, options);
    }
    let url, stylesheet;
    if (css.trim()) {
      stylesheet = document.createElement("link");
      stylesheet.setAttribute("rel", "stylesheet");
      render(css).then((res) => {
        const file = new Blob([res.css], { type: "text/css" });
        url = URL.createObjectURL(file);
        stylesheet.setAttribute("href", url);
        document.head.appendChild(stylesheet);
      });
    }
    return () => {
      onDestroy && doActions(onDestroy.actions, options);
      url && URL.revokeObjectURL(url);
      stylesheet && document.head.removeChild(stylesheet);
    };
  }, []);

  useEffect(() => {
    if (onUpdate) {
      doActions(onUpdate.actions, options);
    }
  }, [options]);

  return (
    <ViewerContext.Provider value={options}>
      <ProFormProvider ref={formRef}>
        {schema.body.map((component, idx) => (
          <ViewerItem key={idx} item={component} />
        ))}
      </ProFormProvider>
    </ViewerContext.Provider>
  );
}
