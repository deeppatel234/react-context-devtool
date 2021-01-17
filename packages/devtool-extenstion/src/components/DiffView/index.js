import React, { memo } from "react";
import { formatters, diff } from "jsondiffpatch";

import "jsondiffpatch/dist/formatters-styles/html.css"

import "./index.scss";

const DiffView = memo(({ data, oldData }) => {
  const delta = diff(oldData, data);

  return (
    <div className="diff-view">
      <div dangerouslySetInnerHTML={{ __html: formatters.html.format(delta, data) }} />
    </div>
  );
});

export default DiffView;
