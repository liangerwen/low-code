import { useCallback, forwardRef, useRef, useImperativeHandle } from "react";
import { FormProviderContext } from "@arco-design/web-react/es/Form/context";

const FormProviderComponent = function (props, ref) {
  const formsRef = useRef({});
  const register = useCallback(function (name, form) {
    if (name) {
      formsRef.current[name] = form;
    }
    return function () {
      delete formsRef.current[name];
    };
  }, []);
  const onFormSubmit = useCallback(
    function (name, changedValues) {
      props.onFormSubmit &&
        props.onFormSubmit(name, changedValues, {
          forms: formsRef.current,
        });
    },
    [props.onFormSubmit]
  );
  const onFormValuesChange = useCallback(
    function (name, values) {
      props.onFormValuesChange &&
        props.onFormValuesChange(name, values, {
          forms: formsRef.current,
        });
    },
    [props.onFormValuesChange]
  );
  useImperativeHandle(ref, () => formsRef.current);
  return (
    <FormProviderContext.Provider
      value={{
        onFormValuesChange,
        onFormSubmit,
        register,
      }}
    >
      {props.children}
    </FormProviderContext.Provider>
  );
};

export default forwardRef(FormProviderComponent);
