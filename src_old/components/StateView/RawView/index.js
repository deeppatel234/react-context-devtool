import React, { useEffect, useRef, useContext } from "react";
import CodeMirror from 'codemirror';

import 'codemirror/mode/javascript/javascript';
import 'codemirror/lib/codemirror.css';
import 'codemirror/addon/edit/closebrackets';
import 'codemirror/addon/edit/matchbrackets';
import 'codemirror/theme/monokai.css';
import 'codemirror/theme/neo.css';

import ThemeContext, { THEME } from "../../../App/ThemeContext";

import { RawViewWrapper } from "./styled";

const codeMirrorTheme = {
  [THEME.LIGHT]: 'neo',
  [THEME.DARK]: 'monokai',
};

const RawView = props => {
  const editorRef = useRef(null);
  const editor = useRef();
  const theme = useContext(ThemeContext);

  useEffect(() => {
    editor.current = CodeMirror(editorRef.current, {
      matchBrackets: true,
      autoCloseBrackets: true,
      mode: "application/json",
      lineWrapping: true,
      lineNumbers: true,
      theme: codeMirrorTheme[theme],
      readOnly: true
    });
  }, []);

  useEffect(() => {
    if (editor.current) {
      editor.current.setOption('theme', codeMirrorTheme[theme]);
    }
  }, [theme]);

  useEffect(() => {
    editor.current.setValue(JSON.stringify(props.data, null, 4));
  }, [props.data]);

  return (
    <RawViewWrapper ref={editorRef} />
  );
};

export default RawView;
