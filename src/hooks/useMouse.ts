import { useCallback, useEffect, useState } from "react";

export default () => {
  const [position, setPosition] = useState({ X: 0, Y: 0 });

  const changePosition = useCallback((e: Event) => {
    const event = (e || window.event) as MouseEvent;
    setPosition({
      X: event.pageX,
      Y: event.pageY,
    });
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", changePosition);
    return () => {
      window.removeEventListener("mousemove", changePosition);
    };
  }, []);

  return position;
};
