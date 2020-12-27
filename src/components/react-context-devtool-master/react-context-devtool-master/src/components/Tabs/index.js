import React from "react";
import classnames from "classnames";

import "./index.scss";

const Tabs = ({ items, selected, onChange, ...props }) => {
  return (
    <div className="tabs" {...props}>
      {items.map(({ text, value }) => (
        <div
          key={value}
          className={classnames({
            tab: true,
            selected: selected === value,
          })}
          onClick={() => onChange(value)}
        >
          {text}
        </div>
      ))}
    </div>
  );
};

Tabs.defaultProps = {};

export default Tabs;
