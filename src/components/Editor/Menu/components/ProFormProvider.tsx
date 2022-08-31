import { noop } from "lodash";
import {
  useCallback,
  forwardRef,
  useRef,
  useImperativeHandle,
  createContext,
} from "react";

export const FormProviderContext = createContext({
  collect: noop,
});

const FormProviderComponent = function (props, ref) {
  const formsRef = useRef({});
  const collect = useCallback(function (name, form) {
    if (name) {
      formsRef.current[name] = form;
    }
    return function () {
      delete formsRef.current[name];
    };
  }, []);
  useImperativeHandle(ref, () => formsRef.current);
  return (
    <FormProviderContext.Provider
      value={{
        collect,
      }}
    >
      {props.children}
    </FormProviderContext.Provider>
  );
};

export default forwardRef(FormProviderComponent);
