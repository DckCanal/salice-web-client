import * as React from "react";
import { useRouter } from "next/router";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import axios from "axios";
import validator from "validator";
import { useUser } from "../lib/hooks";
import StyledPaper from "./StyledPaper";

export default function SignIn() {
  const [inputError, setInputError] = React.useState(false);
  const [emailError, setEmailError] = React.useState(false);
  const [waitingLoginAttempt, setWaitingLoginAttempt] = React.useState(false);
  const [successfulLogin, setSuccessfulLogin] = React.useState(false);
  const router = useRouter();
  const { mutate } = useUser();
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
        url: "/api/users/login",
        withCredentials: true,
        data: {
          email,
          password,
        },
      });
      setWaitingLoginAttempt(false);
      if (res.data.status === "success") {
        setSuccessfulLogin(true);
        setEmailError(false);
        setInputError(false);
        mutate(res?.data?.data);
        // router.push("/dashboard");
      }
    } catch (err) {
      setWaitingLoginAttempt(false);
      console.log(err.code, err.response.status);
      const { status } = err.response;
      if (status == 400) {
        // BAD REQUEST, missing email or password
        setInputError(true);
      } else if (status == 401) {
        // UNAUTHORIZED, wrong email or password
        setInputError(true);
      } else if (status == 500) {
        //TODO: INTERNAL SERVER ERROR
      }
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <StyledPaper sx={{ p: 3, mt: 6 }}>
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography component="h1" variant="h5">
            Accedi
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
              label="Indirizzo email"
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
            {successfulLogin ? (
              <Typography
                component="h1"
                variant="h5"
                color="#4caf50"
                align="center"
              >
                Benvenuto!
              </Typography>
            ) : (
              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={waitingLoginAttempt || inputError || emailError}
                sx={{ mt: 3, mb: 2 }}
              >
                Entra
              </Button>
            )}
          </Box>
        </Box>
      </StyledPaper>
    </Container>
  );
}
