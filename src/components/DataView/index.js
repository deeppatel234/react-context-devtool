import React, { useState } from "react";
import DiffView from "../DiffView";
import StateView from "../StateView";

import { DataViewTab, DataViewTabItem } from "./styled";

const VIEWS = {
  STATE: {
    id: "STATE",
    label: "State",
    component: StateView
  },
  DIFF: {
    id: "DIFF",
    label: "Diff",
    component: DiffView
  }
};

const DataView = ({ data, oldValue }) => {
  const [selectedView, setView] = useState(VIEWS.STATE.id);

  const Comp = VIEWS[selectedView].component;

  return (
    <>
      <DataViewTab>
        {Object.keys(VIEWS).map(k => {
          return (
            <DataViewTabItem
              key={k}
              isSelected={selectedView === VIEWS[k].id}
              onClick={() => setView(k)}
            >
              {VIEWS[k].label}
            </DataViewTabItem>
          );
        })}
      </DataViewTab>
      <Comp data={data} oldValue={oldValue} />
    </>
  );
};

export default DataView;
