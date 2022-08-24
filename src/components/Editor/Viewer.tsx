import { isEmpty } from "lodash";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { useNavigate, useParams } from "react-router-dom";
import ErrorComp from "./components/ErrorComp";
import { getComponentByName } from "./Menu/ComponentsTab/data";
import { doActions } from "./utils/events";
import { parseChildren, parsePropsForViewer } from "./utils/parse";

interface ItemProps {
  item: IComponent;
  data: Record<string, any>;
  setData: (data: Record<string, any>) => void;
}

const ViewerContext = createContext(null);

function ViewerCommonItem({ item }) {
  const { id, name, props: p = {}, children } = item as IComponent;

  const options = useContext(ViewerContext);
  const itemOptions = useMemo(
    () => ({ ...options, current: item }),
    [options, item]
  );

  const Common = getComponentByName(name);
  const commonProps = useMemo(() => parsePropsForViewer(p, itemOptions), [p]);
  const commonChildren = useMemo(
    () =>
      parseChildren(children, {
        render: (child, idx) => <ViewerCommonItem item={child} key={idx} />,
      }),
    [children]
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

  const [pageData, setPageData] = useState(data);

  const navigate = useNavigate();
  const params = useParams();

  const options = useMemo(
    () => ({
      navigate,
      params,
      schema,
      current: null,
    }),
    [props.schema]
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
  });

  return (
    <ViewerContext.Provider value={options}>
      {schema.body.map((component, idx) => (
        <ViewerItem
          key={idx}
          item={component}
          data={pageData}
          setData={setPageData}
        />
      ))}
    </ViewerContext.Provider>
  );
}
