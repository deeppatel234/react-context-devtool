import React, { useEffect, useState } from "react";

import Button from "Components/Button";

import "./index.scss";

const Settings = () => {
  const [startDebugWhen, setStartDebugWhen] = useState("extensionLoad");

  const onChangeStartDebugWhen = (event) => {
    setStartDebugWhen(event.target.value);
  };

  useEffect(() => {
    chrome.storage.local.get(['startDebugWhen'], function(result) {
      if (result.startDebugWhen) {
        setStartDebugWhen(result.startDebugWhen);
      }
    });
  }, []);

  const onClickSave = () => {
    const settingstoSave = {
      startDebugWhen,
    };

    chrome.storage.local.set(settingstoSave, function(event) {
      console.log('Value is set to ', event);
    });
  };

  return (
    <div className="settings-wrapper">
      <div className="setting-section">
        <div className="setting-section-label">Start debugging</div>
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
      <div className="setting-footer">
        <Button onClick={onClickSave}>Save</Button>
      </div>
    </div>
  );
};

export default Settings;
