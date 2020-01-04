import { THEME } from "./ThemeContext";

export default {
  [THEME.LIGHT]: {
    whiteText: "#424242",
    background: "#FAFAFA",
    borderColor: "#9E9E9E",
    hoverBackground: "rgba(0, 0, 0, 0.1)",
    selectedBackground: "rgba(0, 0, 0, 0.2)",
    editorBackground: "#fff"
  },
  [THEME.DARK]: {
    whiteText: "#fff",
    background: "#292D3E",
    borderColor: "rgba(255, 255, 255, 0.5)",
    hoverBackground: "rgba(255, 255, 255, 0.1)",
    selectedBackground: "rgba(255, 255, 255, 0.2)",
    editorBackground: "rgb(39,40,34)"
  }
};
