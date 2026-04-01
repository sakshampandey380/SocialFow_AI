import { useContext } from "react";

import { ThemeContext } from "../context/themecontext";

export function useTheme() {
  return useContext(ThemeContext);
}
