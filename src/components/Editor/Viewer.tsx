import useSyncState from "@/hooks/useSyncState";
import { FormInstance } from "@arco-design/web-react";
import { isEmpty, noop } from "lodash";
import { createContext, useContext, useEffect, useMemo, useRef } from "react";
import { ErrorBoundary } from "react-error-boundary";
import {
  NavigateFunction,
  Params,
  useNavigate,
  useParams,
} from "react-router-dom";
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

function ViewerCommonItem({ item }) {
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
      <Common {...commonProps}>{commonChildren}</Common>
    </ErrorBoundary>
  );
}

const ViewerItem = (props: ItemProps) => {
  const { item, ...reset } = props;
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

  return (
    <ErrorBoundary
      fallbackRender={(args) => <ErrorComp {...args} name={name} id={id} />}
    >
      {container ? (
        <Comp {...CompProps}>
          {!isEmpty(children) &&
            (children as IComponent[]).map((c, idx) => (
              <ViewerItem item={c} key={idx} {...reset} />
            ))}
        </Comp>
      ) : (
        <ViewerCommonItem item={item} />
      )}
    </ErrorBoundary>
  );
};

export interface IProps {
  schema: ISchema;
}

export default function EditorViewer(props: IProps) {
  const { schema } = props;
  const { onDestroy, onLoad, onUpdate, data = {} } = schema;

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
    return () => {
      if (onDestroy) {
        doActions(onDestroy.actions, options);
      }
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
