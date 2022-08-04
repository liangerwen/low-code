import { useEffect, useMemo, useState } from "react";
import EditorIcon from "./Menu/components/EditorIcon";
import { getComponentByName } from "./Menu/ComponentsTab/data";
import { createAction, createEvents } from "./utils/events";

interface ItemProps {
  item: IComponent;
  data: Record<string, any>;
  setData: (data: Record<string, any>) => void;
}

const ViewerItem = (props: ItemProps) => {
  const { item, ...reset } = props;
  const { container, name, attrs = {}, children = [], events = {} } = item;

  const Common = getComponentByName(name);

  const commomProps = useMemo(() => {
    const p = {};
    Object.keys(attrs).forEach((ak) => {
      p[ak] = attrs[ak]?.isIcon ? (
        <EditorIcon name={attrs[ak].name} />
      ) : (
        attrs[ak]
      );
    });
    return {
      ...p,
      ...createEvents(events, { window }),
    };
  }, [attrs, events]);

  const commonChildren = useMemo(
    () =>
      children.map((c, idx) => {
        if (typeof c === "string") return c;
        if ((c as IconType).isIcon === true)
          return <EditorIcon name={c.name} key={idx} />;
        return <ViewerItem item={c} key={idx} {...reset} />;
      }),
    [children]
  );

  useEffect(() => {
    if (!container) {
      console.log(commonChildren);
    }
  }, []);

  return (
    <>
      {container ? (
        <Common {...commomProps}>
          {children.length > 0 &&
            (children as IComponent[]).map((c, idx) => (
              <ViewerItem item={c} key={idx} {...reset} />
            ))}
        </Common>
      ) : (
        <Common {...commomProps}>{commonChildren}</Common>
      )}
    </>
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
      createAction(onLoad, { window, data: pageData, setData: setPageData })();
    }
    return () => {
      if (onDestroy) {
        createAction(onDestroy, {
          window,
          data: pageData,
          setData: setPageData,
        })();
      }
    };
  }, []);

  useEffect(() => {
    if (onUpdate) {
      createAction(onUpdate, {
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
