import React, { useState } from "react";

import TreeView from './TreeView';
import RawView from './RawView';

import { StateViewTab, StateViewTabItem } from "./styled";

const VIEWS = {
  TREE: {
    id: "TREE",
    label: "Tree",
    component: TreeView
  },
  RAW: {
    id: "RAW",
    label: "Raw",
    component: RawView
  }
};

const StateView = ({ data, oldValue }) => {
  const [selectedView, setView] = useState(VIEWS.TREE.id);

  const Comp = VIEWS[selectedView].component;

  return (
    <>
      <StateViewTab>
        {Object.keys(VIEWS).map(k => {
          return (
            <StateViewTabItem
              key={k}
              isSelected={selectedView === VIEWS[k].id}
              onClick={() => setView(k)}
            >
              {VIEWS[k].label}
            </StateViewTabItem>
          );
        })}
      </StateViewTab>
      <Comp data={data} oldValue={oldValue} />
    </>
  );
};

export default StateView;
