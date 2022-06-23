import { Button, ButtonProps } from "@arco-design/web-react";
import { forwardRef } from "react";

export default forwardRef(function IconButton(props: ButtonProps, ref) {
  const { icon, ...rest } = props;
  return (
    <Button ref={ref} icon={icon} shape="circle" type="secondary" {...rest} />
  );
});
