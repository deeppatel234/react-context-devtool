import React from "react";
import classnames from "classnames";

import Button from "Components/Button";

const ButtonGroup = ({ buttons, selected, onChange, ...props }) => {
  return (
    <div {...props} className={classnames("button-group", props.className)}>
      {buttons.map(({ text, icon, value }) => (
        <Button key={value} outline={selected !== value} onClick={() => onChange(value)}>
          {icon}
          {text}
        </Button>
      ))}
    </div>
  );
};

ButtonGroup.defaultProps = {};

export default ButtonGroup;
