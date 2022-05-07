import * as React from "react";
import { Paper } from "@mui/material";
import Avatar from "@mui/material/Avatar";
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

// function Copyright(props) {
//   return (
//     <Typography variant="body2" color="text.secondary" align="center" {...props}>
//       {'Copyright © '}
//       <Link color="inherit" href="https://mui.com/">
//         Your Website
//       </Link>{' '}
//       {new Date().getFullYear()}
//       {'.'}
//     </Typography>
//   );
// }

const theme = createTheme({
  palette: {
    mode: "dark",
  },
});

export default function SignIn({ loginUrl }) {
  const [inputError, setInputError] = React.useState(false);
  const [emailError, setEmailError] = React.useState(false);
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
      const res = await axios({
        method: "POST",
        url: loginUrl,
        withCredentials: true,
        data: {
          email,
          password,
        },
      });
      if (res.data.status === "success") {
        setEmailError(false);
        setInputError(false);
        window.setTimeout(() => {
          location.assign("/dashboard");
        }, 1500);
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
            {/* <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar> */}
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
                sx={{ mt: 3, mb: 2 }}
              >
                Sign In
              </Button>
              {/* <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link href="#" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid> */}
            </Box>
          </Box>
        </Paper>
        {/* <Copyright sx={{ mt: 8, mb: 4 }} /> */}
      </Container>
    </ThemeProvider>
  );
}
