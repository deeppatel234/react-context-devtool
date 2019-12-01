import React, { useEffect, useRef } from "react";
import CodeMirror from 'codemirror';

import 'codemirror/mode/javascript/javascript';
import 'codemirror/lib/codemirror.css';
import 'codemirror/addon/edit/closebrackets';
import 'codemirror/addon/edit/matchbrackets';
import 'codemirror/theme/monokai.css';

import { RawViewWrapper } from "./styled";

const RawView = props => {
  const editorRef = useRef(null);
  const editor = useRef();

  useEffect(() => {
    editor.current = CodeMirror(editorRef.current, {
      matchBrackets: true,
      autoCloseBrackets: true,
      mode: "application/json",
      lineWrapping: true,
      lineNumbers: true,
      theme: 'monokai',
      readOnly: true
    });
  }, []);

  useEffect(() => {
    editor.current.setValue(JSON.stringify(props.data, null, 4));
  }, [props.data]);

  return (
    <RawViewWrapper ref={editorRef} />
  );
};

export default RawView;
