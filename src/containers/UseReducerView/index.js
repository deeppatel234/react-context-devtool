import React, { useState, useEffect } from "react";
import classnames from "classnames";

import JsonTree from "Components/JsonTree";
import JsonEditor from "Components/JsonEditor";
import DiffView from "Components/DiffView";

import ButtonGroup from "Components/ButtonGroup";
import Tabs from "Components/Tabs";

import "./index.scss";

const Views = [
  {
    text: "State",
    value: "state",
  },
  {
    text: "Action",
    value: "action",
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
    },
  ],
  action: [
    {
      text: "Tree",
      value: "tree",
    },
    {
      text: "Raw",
      value: "raw",
    },
  ],
};

const DataViews = {
  state: {
    tree: JsonTree,
    raw: JsonEditor,
  },
  diff: {
    raw: DiffView,
  },
  action: {
    tree: JsonTree,
    raw: JsonEditor,
  },
};

const UseReducerView = ({ id, debugData }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedView, setView] = useState("state");
  const [selectedSubview, setSubView] = useState("tree");

  useEffect(() => {
    setSelectedIndex(0);
  }, [id]);

  useEffect(() => {
    setSelectedIndex(debugData.actions.length - 1);
  }, [debugData?.actions?.length]);

  const onChangeView = (view) => {
    if (view === "diff") {
      setSubView("raw");
    } else {
      setSubView("tree");
    }
    setView(view);
  };

  console.log("debugData", debugData);

  const View = DataViews[selectedView][selectedSubview];

  return (
    <div className="use-reducer-view">
      <div className="action-view">
        <p className="title">Actions</p>
        <ul>
          {debugData.actions.map((action, index) => {
            return (
              <li
                key={index}
                className={classnames({
                  selected: selectedIndex === index,
                })}
                onClick={() => setSelectedIndex(index)}
              >
                {action.initialState ? "Initial State" : JSON.stringify(action)}
              </li>
            );
          })}
        </ul>
      </div>
      <div className="state-view">
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
          {selectedView === "action" ? (
            <View data={debugData.actions[selectedIndex] || {}} />
          ) : (
            <View
              data={debugData.state[selectedIndex] || {}}
              oldData={debugData.state[selectedIndex - 1] || {}}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default UseReducerView;
