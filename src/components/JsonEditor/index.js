import React, { useEffect, useRef, memo } from "react";
import CodeMirror from "codemirror";
import jsonlint from "jsonlint-mod";

window.jsonlint = jsonlint;

import "codemirror/mode/javascript/javascript";
import "codemirror/lib/codemirror.css";
import "codemirror/addon/edit/closebrackets";
import "codemirror/addon/edit/matchbrackets";
import "codemirror/addon/lint/lint";
import "codemirror/addon/lint/json-lint";
import "codemirror/theme/material-ocean.css";
import "codemirror/addon/lint/lint.css";

import "./index.scss";

const JsonEditor = memo(({ data, editable, onChange, setEditorRef, lint }) => {
  const editorRef = useRef(null);
  const editor = useRef();

  useEffect(() => {
    const options = {
      matchBrackets: true,
      autoCloseBrackets: true,
      mode: "application/json",
      lineWrapping: true,
      lineNumbers: true,
      theme: "material-ocean",
      readOnly: !editable,
    };

    if (lint) {
      options.lint = true;
      options.gutters = ["CodeMirror-lint-markers"];
      options.styleActiveLine = true;
    }

    editor.current = CodeMirror(editorRef.current, options);

    if (onChange) {
      editor.current.on("change", () => {
        onChange(editor.current.getValue());
      });
    }

    if (setEditorRef) {
      setEditorRef.current = editor.current;
    }
  }, []);

  useEffect(() => {
    if (!onChange) {
      editor.current.setValue(JSON.stringify(data, null, 4));
    }
  }, [data]);

  return <div className="json-editor" ref={editorRef} />;
});

JsonEditor.defaultProps = {
  editable: false,
  data: {},
  lint: false,
};

export default JsonEditor;
