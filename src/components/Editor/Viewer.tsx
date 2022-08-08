import { isArray } from "lodash";
import { useEffect, useMemo, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import ErrorComp from "./components/ErrorComp";
import { getComponentByName } from "./Menu/ComponentsTab/data";
import { createAction } from "./utils/events";
import { parseChildren, parseProps } from "./utils/parse";

interface ItemProps {
  item: IComponent;
  data: Record<string, any>;
  setData: (data: Record<string, any>) => void;
}

const ViewerItem = (props: ItemProps) => {
  const { item, ...reset } = props;
  const { id, container, name, props: p = {}, children } = item;

  const Common = getComponentByName(name);

  const commonProps = useMemo(() => parseProps(p, { window }), [p]);
  const commonChildren = useMemo(() => parseChildren(children), [children]);

  return (
    <ErrorBoundary
      fallbackRender={(args) => <ErrorComp {...args} name={name} id={id} />}
    >
      {container ? (
        <Common {...commonProps}>
          {isArray(children) &&
            (children as IComponent[]).map((c, idx) => (
              <ViewerItem item={c} key={idx} {...reset} />
            ))}
        </Common>
      ) : (
        <Common {...commonProps}>{commonChildren}</Common>
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
