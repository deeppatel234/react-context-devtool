import React from "react";
import classnames from "classnames";

import "./index.scss";

const Badge = ({ children, outline, onClick, className, ...props }) => {
  return (
    <span
      className={classnames({
        badge: true,
        outline,
        pointer: !!onClick
      }, className)}
      onClick={onClick}
      {...props}
    >
      {children}
    </span>
  );
};

Badge.defaultProps = {
  outline: false,
};

export default Badge;
