import { useEffect, useRef, useState } from "react";
import { produce } from "immer";

/**
 * 同步的useState
 * @param state
 * @returns [state, setState]
 */
const useSyncState = <T extends Object>(
  initialValues: T
): [T, (val: T | ((val: T) => void), callback?: (val: T) => void) => void] => {
  const callbackRef = useRef<(val: T) => void>();
  const [state, setState] = useState<T>(initialValues);

  useEffect(() => {
    callbackRef.current && callbackRef.current(state);
  }, [state]);

  return [
    state,
    (val, callback) => {
      callbackRef.current = callback;
      if (typeof val === "function") {
        setState(produce(state, val as (val: T) => void));
      } else {
        setState(val);
      }
    },
  ];
};

export default useSyncState;
