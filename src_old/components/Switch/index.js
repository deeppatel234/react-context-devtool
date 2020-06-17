import React from "react";

import { SwitchWrapper, Checkbox, Slider } from "./styled";

const Switch = ({ className, ...props }) => {
  return (
    <SwitchWrapper className={className}>
      <Checkbox type="checkbox" {...props} />
      <Slider />
    </SwitchWrapper>
  )
};

export default Switch;
