import React from "react";
import classnames from "classnames";

import "./index.scss";

const Button = ({ children, outline, className, ...props }) => {
  return (
    <button
      className={classnames(
        {
          button: true,
          outline,
        },
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

Button.defaultProps = {
  outline: false,
};

export default Button;
