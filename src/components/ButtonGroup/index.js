import React from "react";

import Button from "Components/Button";

const ButtonGroup = ({ buttons, selected, onChange, ...props }) => {
  return (
    <div {...props}>
      {buttons.map(({ text, icon, value }) => (
        <Button outline={selected !== value} onClick={() => onChange(value)}>
          {icon}
          {text}
        </Button>
      ))}
    </div>
  );
};

ButtonGroup.defaultProps = {};

export default ButtonGroup;
