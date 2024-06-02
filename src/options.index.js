import React from "react";
import { createRoot } from "react-dom/client";

import OptionsApp from "./containers/OptionsApp";

const domNode = document.getElementById("optionsRoot");
const root = createRoot(domNode);

root.render(<OptionsApp />);
