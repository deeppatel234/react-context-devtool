import React from "react";

export const THEME = {
  LIGHT: "light",
  DARK: "dark"
};

const ThemeContext = React.createContext(THEME.DARK);

export default ThemeContext;
