import React, { useEffect, useState } from "react";

import Button from "Components/Button";

import "./index.scss";

const Settings = () => {
  const [startDebugWhen, setStartDebugWhen] = useState("extensionLoad");
  const [debugUseReducer, setDebugUseReducer] = useState(true);
  const [debugContext, setDebugContext] = useState(true);

  const onChangeStartDebugWhen = (event) => {
    setStartDebugWhen(event.target.value);
  };

  const onChangeDebugUseReducer = (event) => {
    setDebugUseReducer(event.target.checked);
  };

  const onChangeDebugContext = (event) => {
    setDebugContext(event.target.checked);
  };

  useEffect(() => {
    chrome.storage.local.get(
      ["startDebugWhen", "debugUseReducer", "debugContext"],
      function (result) {
        if (result.startDebugWhen) {
          setStartDebugWhen(result.startDebugWhen);
        }
        if (typeof result.debugUseReducer !== "undefined") {
          setDebugUseReducer(result.debugUseReducer);
        }
        if (typeof result.debugContext !== "undefined") {
          setDebugContext(result.debugContext);
        }
      }
    );
  }, []);

  const onClickSave = () => {
    const settingstoSave = {
      startDebugWhen,
      debugUseReducer,
      debugContext,
    };

    chrome.storage.local.set(settingstoSave);
  };

  return (
    <div className="settings-wrapper">
      <div className="setting-section">
        <div className="setting-section-label">Start Debugging</div>
        <div className="setting-section-value">
          <div className="setting-radio-wrapper">
            <input
              type="radio"
              id="extensionLoad"
              name="startDebugWhen"
              value="extensionLoad"
              className="setting-radio"
              checked={startDebugWhen === "extensionLoad"}
              onChange={onChangeStartDebugWhen}
            />
            <label htmlFor="extensionLoad" className="setting-radio-label">
              On Extensions Load
              <div className="light-text">
                Start data capturing after extenstion is opened in dev panel
              </div>
            </label>
          </div>
          <div className="setting-radio-wrapper">
            <input
              type="radio"
              id="pageLoad"
              name="startDebugWhen"
              value="pageLoad"
              className="setting-radio"
              checked={startDebugWhen === "pageLoad"}
              onChange={onChangeStartDebugWhen}
            />
            <label htmlFor="pageLoad" className="setting-radio-label">
              On Page Load
              <div className="light-text">
                Start data capturing after page load
              </div>
            </label>
          </div>
        </div>
      </div>
      <div className="setting-section">
        <div className="setting-section-label">Enable Debug</div>
        <div className="setting-section-value">
          <div className="setting-radio-wrapper">
            <input
              type="checkbox"
              id="useReducer"
              className="setting-radio"
              checked={debugUseReducer}
              onChange={onChangeDebugUseReducer}
            />
            <label htmlFor="useReducer" className="setting-radio-label">
              useReducer
            </label>
          </div>
          <div className="setting-radio-wrapper">
            <input
              type="checkbox"
              id="context"
              className="setting-radio"
              checked={debugContext}
              onChange={onChangeDebugContext}
            />
            <label htmlFor="context" className="setting-radio-label">
              Context
            </label>
          </div>
        </div>
      </div>
      <div className="setting-footer">
        <Button onClick={onClickSave}>Save</Button>
      </div>
    </div>
  );
};

export default Settings;
