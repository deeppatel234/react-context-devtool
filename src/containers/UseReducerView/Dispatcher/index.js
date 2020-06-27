import React, { useState, useRef, useEffect } from "react";
import classnames from "classnames";

import JsonEditor from "Components/JsonEditor";
import Button from "Components/Button";

import "./style.scss";

const Dispatcher = ({ onDispatch }) => {
  const [show, setShow] = useState(false);
  const [action, setAction] = useState("");
  const editor = useRef();

  const onClickDispatch = () => {
    try {
      const actionTodistpatch = JSON.parse(action);
      onDispatch(actionTodistpatch);
      setShow(false);
      editor.current.setValue("");
      setAction("");
    } catch (err) {}
  };

  const onClickBeautify = () => {
    try {
      editor.current.setValue(JSON.stringify(JSON.parse(action), null, 4));
    } catch (err) {}
  };

  return (
    <div className={classnames({
      "dispatcher-view": true,
      "show": show,
    })}>
      <div className="dispatcher-button" onClick={() => setShow(!show)}>
        Dispatch Action
      </div>
      <JsonEditor editable onChange={setAction} setEditorRef={editor} lint />
      <div className="actions">
        <div className="beautify" onClick={onClickBeautify}>Beautify</div>
        <Button onClick={onClickDispatch}>Dispatch</Button>
      </div>
    </div>
  );
};

export default Dispatcher;
