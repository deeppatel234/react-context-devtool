import React, { useEffect, useRef } from "react";
import CodeMirror from 'codemirror';

import 'codemirror/mode/javascript/javascript';
import 'codemirror/lib/codemirror.css';
import 'codemirror/addon/edit/closebrackets';
import 'codemirror/addon/edit/matchbrackets';
import 'codemirror/theme/material-ocean.css';

import "./index.scss";

const JsonEditor = ({ data }) => {
  const editorRef = useRef(null);
  const editor = useRef();

  useEffect(() => {
    editor.current = CodeMirror(editorRef.current, {
      matchBrackets: true,
      autoCloseBrackets: true,
      mode: "application/json",
      lineWrapping: true,
      lineNumbers: true,
      theme: "material-ocean",
      readOnly: true,
    });
  }, []);

  useEffect(() => {
    editor.current.setValue(JSON.stringify(data, null, 4));
  }, [data]);

  return (
    <div className="json-editor" ref={editorRef} />
  );
};

export default JsonEditor;
