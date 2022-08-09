import { isEmpty } from "lodash";
import { useEffect, useMemo, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import ErrorComp from "./components/ErrorComp";
import { getComponentByName } from "./Menu/ComponentsTab/data";
import { createAction } from "./utils/events";
import { parseChildren, parseProps } from "./utils/parse";
import useGlobal from "./utils/useGlobal";

interface ItemProps {
  item: IComponent;
  data: Record<string, any>;
  setData: (data: Record<string, any>) => void;
}

function ViewerCommonItem({ item }) {
  const { id, name, props: p = {}, children } = item as IComponent;

  const global = useGlobal();

  const Common = getComponentByName(name);
  const commonProps = useMemo(() => parseProps(p, global), [p]);
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
  const global = useGlobal();

  const Comp = getComponentByName(name);
  const CompProps = useMemo(() => parseProps(p, global), [p, global]);

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

  useEffect(() => {
    if (onLoad) {
      createAction(onLoad.actions, {
        window,
        data: pageData,
        setData: setPageData,
      })();
    }
    return () => {
      if (onDestroy) {
        createAction(onDestroy.actions, {
          window,
          data: pageData,
          setData: setPageData,
        })();
      }
    };
  }, []);

  useEffect(() => {
    if (onUpdate) {
      createAction(onUpdate.actions, {
        window,
        data: pageData,
        setData: setPageData,
      })();
    }
  });

  return (
    <>
      {schema.body.map((component, idx) => (
        <ViewerItem
          key={idx}
          item={component}
          data={pageData}
          setData={setPageData}
        />
      ))}
    </>
  );
}
