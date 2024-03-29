import { useState, useEffect } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { teal, purple } from "@mui/material/colors";
import { CssBaseline } from "@mui/material";
import { itIT } from "@mui/material/locale";
import { itIT as itITdataGrid } from "@mui/x-data-grid";
//import { itIT as itITdateTimePicker } from "@mui/x-date-pickers";
import "../styles/globals.css";
import { SwitchThemeContext } from "../components/ThemeContext";

const mdTheme = createTheme(
  {
    palette: {
      primary: {
        main: teal[500],
      },
      secondary: {
        main: purple[500],
      },
    },
  },
  itIT,
  itITdataGrid
  //itITdateTimePicker
);
const darkTheme = createTheme(
  {
    palette: {
      mode: "dark",
      primary: {
        main: teal[300],
      },
      secondary: {
        main: purple[300],
      },
    },
  },
  itIT,
  itITdataGrid
  //itITdateTimePicker
);

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
