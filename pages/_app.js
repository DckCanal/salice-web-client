import { useState, useEffect } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";

import "../styles/globals.css";
import { SwitchThemeContext } from "../components/ThemeContext";

const mdTheme = createTheme();
const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

function MyApp({ Component, pageProps }) {
  const [lightTheme, setLightTheme] = useState(false);
  const getLayout = Component.getLayout || ((page) => page);

  useEffect(() => {
    window.matchMedia &&
      setLightTheme(
        window.matchMedia("(prefers-color-scheme: dark)").matches ? false : true
      );
    const handleColorSchemeChange = (event) => setLightTheme(event.matches);
    window
      .matchMedia("(prefers-color-scheme: light)")
      .addEventListener("change", handleColorSchemeChange);

    return () => {
      window
        .matchMedia("(prefers-color-scheme: light)")
        .removeEventListener("change", handleColorSchemeChange);
    };
  }, []);

  return (
    <ThemeProvider theme={lightTheme ? mdTheme : darkTheme}>
      <CssBaseline />
      <SwitchThemeContext.Provider
        value={() => {
          setLightTheme(!lightTheme);
        }}
      >
        {getLayout(<Component {...pageProps} />)}
      </SwitchThemeContext.Provider>
    </ThemeProvider>
  );
}

export default MyApp;
