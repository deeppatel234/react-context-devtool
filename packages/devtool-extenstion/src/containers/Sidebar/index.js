import React, { useContext, useState, useEffect } from "react";
import classnames from "classnames";

import Badge from "Components/Badge";

import AppContext from "Containers/AppContext";

import "./index.scss";

const FILTERS = ["context", "useReducer"];

const Sidebar = () => {
  const { appData, selectedDebug, setDebug, settings } = useContext(AppContext);
  const [selectedFilters, setFilters] = useState([...FILTERS]);

  const contextList = Object.keys(appData.context).map((key) => {
    return {
      value: key,
      text: appData.context[key].newValue.displayName || key,
      type: "context",
    };
  });

  const useReducerList = Object.keys(appData.useReducer).map((key) => {
    return {
      value: key,
      text: appData.useReducer[key].displayName || key,
      type: "useReducer",
    };
  });

  useEffect(() => {
    if (contextList.length) {
      setDebug({ id: contextList[0].value, type: contextList[0].type });
    } else if (useReducerList.length) {
      setDebug({ id: useReducerList[0].value, type: useReducerList[0].type });
    }
  }, []);

  const onSelectFilter = (filter) => {
    if (selectedFilters.includes(filter)) {
      setFilters(selectedFilters.filter((f) => f !== filter));
    } else {
      setFilters([...selectedFilters, filter]);
    }
  };

  const filteredList = [...contextList, ...useReducerList].filter(({ type }) =>
    selectedFilters.includes(type)
  );

  return (
    <aside>
      {settings.debugUseReducer && settings.debugContext ? (
        <div className="filters">
          <div>
            <svg
              className="funnel"
              width="1em"
              height="1em"
              viewBox="0 0 16 16"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M1.5 1.5A.5.5 0 0 1 2 1h12a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.128.334L10 8.692V13.5a.5.5 0 0 1-.342.474l-3 1A.5.5 0 0 1 6 14.5V8.692L1.628 3.834A.5.5 0 0 1 1.5 3.5v-2zm1 .5v1.308l4.372 4.858A.5.5 0 0 1 7 8.5v5.306l2-.666V8.5a.5.5 0 0 1 .128-.334L13.5 3.308V2h-11z"
              />
            </svg>
          </div>
          {FILTERS.map((f) => (
            <Badge
              key={f}
              outline={!selectedFilters.includes(f)}
              onClick={() => onSelectFilter(f)}
            >
              {f}
            </Badge>
          ))}
        </div>
      ) : (
        <div className="filters">
          {settings.debugUseReducer ? <Badge>useReducers List</Badge> : null}
          {settings.debugContext ? <Badge>Context List</Badge> : null}
          {!settings.debugContext && !settings.debugUseReducer ? (
            <Badge>Context List</Badge>
          ) : null}
        </div>
      )}
      <ul className="debuglist">
        {filteredList.map(({ value, text, type }) => (
          <li
            key={value}
            className={classnames({
              selected: selectedDebug.id === value,
            })}
            onClick={() => setDebug({ id: value, type })}
          >
            {text}
            <span>{type}</span>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;
