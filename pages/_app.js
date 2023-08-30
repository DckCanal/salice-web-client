import { useState } from "react";
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
