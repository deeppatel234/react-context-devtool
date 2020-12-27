import React, { useState } from "react";

import ButtonGroup from "Components/ButtonGroup";
import Tabs from "Components/Tabs";
import JsonTree from "Components/JsonTree";
import JsonEditor from "Components/JsonEditor";
import DiffView from "Components/DiffView";

import "./index.scss";

const Views = [
  {
    text: "State",
    value: "state",
  },
  {
    text: "Diff",
    value: "diff",
  },
];

const SubViews = {
  state: [
    {
      text: "Tree",
      value: "tree",
    },
    {
      text: "Raw",
      value: "raw",
    },
  ],
  diff: [
    {
      text: "Raw",
      value: "raw",
    }
  ]
};

const DataViews = {
  state: {
    tree: JsonTree,
    raw: JsonEditor,
  },
  diff: {
    raw: DiffView,
  }
};

const ContextView = ({ debugData }) => {
  const [selectedView, setView] = useState("state");
  const [selectedSubview, setSubView] = useState("tree");

  const View = DataViews[selectedView][selectedSubview];

  const onChangeView = view => {
    if (view === "diff") {
      setSubView("raw");
    } else {
      setSubView("tree");
    }
    setView(view);
  }

  return (
    <div className="context-view">
      <div className="view-header">
        <Tabs
          selected={selectedSubview}
          onChange={setSubView}
          items={SubViews[selectedView]}
        />
        <ButtonGroup
          className="view-selector"
          selected={selectedView}
          onChange={onChangeView}
          buttons={Views}
        />
      </div>
      <div className="data-view">
        <View data={debugData?.newValue?.value || {}} oldData={debugData?.oldValue?.value || {}} />
      </div>
    </div>
  );
};

export default ContextView;
