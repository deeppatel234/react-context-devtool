import React from "react";
import ReactDOM from "react-dom";

import OptionsApp from "./containers/OptionsApp";

const Options = () => {
  return (
    <OptionsApp />
  );
};

ReactDOM.render(<Options />, document.getElementById("optionsRoot"));
