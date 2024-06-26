import React, { useEffect, useState } from "react";

import Button from "Components/Button";

import "./index.scss";

const Settings = () => {
  const [startDebugWhenV2, setStartDebugWhenV2] = useState("extensionLoad");
  const [debugUseReducer, setDebugUseReducer] = useState(true);
  const [debugContext, setDebugContext] = useState(true);
  const [showSuccessMsg, setShowSuccessMsg] = useState(false);

  const onChangeStartDebugWhen = (event) => {
    setStartDebugWhenV2(event.target.value);
  };

  const onChangeDebugUseReducer = (event) => {
    setDebugUseReducer(event.target.checked);
  };

  const onChangeDebugContext = (event) => {
    setDebugContext(event.target.checked);
  };

  useEffect(() => {
    chrome.storage.local.get(
      ["startDebugWhenV2", "debugUseReducer", "debugContext"],
      function (result) {
        if (result.startDebugWhenV2) {
          setStartDebugWhenV2(result.startDebugWhenV2);
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
      startDebugWhenV2,
      debugUseReducer,
      debugContext,
    };

    let timer = null;

    if (timer) {
      clearTimeout(timer);
    }

    chrome.storage.local.set(settingstoSave, () => {
      setShowSuccessMsg(true);
      timer = setTimeout(() => {
        setShowSuccessMsg(false);
      }, 3000);
    });
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
              name="startDebugWhenV2"
              value="extensionLoad"
              className="setting-radio"
              checked={startDebugWhenV2 === "extensionLoad"}
              onChange={onChangeStartDebugWhen}
            />
            <label htmlFor="extensionLoad" className="setting-radio-label">
              On Extensions Load
              <div className="light-text">
                Start data capturing after extenstion is opened in dev panel (recommended)
              </div>
            </label>
          </div>
          <div className="setting-radio-wrapper">
            <input
              type="radio"
              id="pageLoad"
              name="startDebugWhenV2"
              value="pageLoad"
              className="setting-radio"
              checked={startDebugWhenV2 === "pageLoad"}
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
              <div className="light-text">
                Available only in development mode
              </div>
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
        <div className="success-msg">
          {showSuccessMsg ? "Settings save successfully" : null}
        </div>
        <Button onClick={onClickSave}>Save</Button>
      </div>
    </div>
  );
};

export default Settings;
