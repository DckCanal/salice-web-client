import * as React from "react";
import { useRouter } from "next/router";
import { Paper } from "@mui/material";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import axios from "axios";
import validator from "validator";

const theme = createTheme({
  palette: {
    mode: "dark",
  },
});

export default function SignIn({ loginUrl }) {
  const [inputError, setInputError] = React.useState(false);
  const [emailError, setEmailError] = React.useState(false);
  const [waitingLoginAttempt, setWaitingLoginAttempt] = React.useState(false);
  const router = useRouter();
  const clearInputError = () => {
    inputError & setInputError(false);
  };
  const validateEmail = (event) => {
    clearInputError();
    const email = event.target.value;
    if (email && !validator.isEmail(email)) {
      setEmailError(true);
    } else {
      setEmailError(false);
    }
  };
  const handlePasswordTyping = (event) => {
    clearInputError();
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const email = data.get("email");
    const password = data.get("password");
    if (!email || !password) {
      setInputError(true);
      return;
    }
    if (!validator.isEmail(email)) return;

    try {
      setWaitingLoginAttempt(true);
      const res = await axios({
        method: "POST",
        url: loginUrl,
        withCredentials: true,
        data: {
          email,
          password,
        },
      });
      setWaitingLoginAttempt(false);
      if (res.data.status === "success") {
        setEmailError(false);
        setInputError(false);
        router.push("/dashboard");
        // window.setTimeout(() => {
        //   location.assign("/dashboard");
        // }, 1500);
      }
    } catch (err) {
      console.log(err.code, err.response.status);
      const { status } = err.response;
      if (status == 400) {
        // BAD REQUEST, missing email or password
        setInputError(true);
      } else if (status == 401) {
        // UNAUTHORIZED, wrong email or password
        setInputError(true);
      } else if (status == 500) {
        // INTERNAL SERVER ERROR
      }
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Paper sx={{ p: 3, mt: 12 }}>
          <Box
            sx={{
              marginTop: 8,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Typography component="h1" variant="h5">
              Sign in
            </Typography>
            <Box
              component="form"
              onSubmit={handleSubmit}
              noValidate
              sx={{ mt: 1 }}
            >
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                error={inputError || emailError}
                onChange={validateEmail}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                error={inputError}
                onChange={clearInputError}
              />
              <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label="Remember me"
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={waitingLoginAttempt}
                sx={{ mt: 3, mb: 2 }}
              >
                Sign In
              </Button>
            </Box>
          </Box>
        </Paper>
      </Container>
    </ThemeProvider>
  );
}
