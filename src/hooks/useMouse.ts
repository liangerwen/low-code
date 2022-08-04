import { useCallback, useState } from "react";
import { useEvent } from "react-use";

/**
 * 鼠标移动hook
 */
export default () => {
  const [position, setPosition] = useState({ X: 0, Y: 0 });

  const changePosition = useCallback((e: Event) => {
    const event = (e || window.event) as MouseEvent;
    setPosition({
      X: event.pageX,
      Y: event.pageY,
    });
  }, []);

  useEvent("mousemove", changePosition)

  return position;
};
