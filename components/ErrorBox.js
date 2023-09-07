import { Typography, Box, Divider } from "@mui/material";
import { red } from "@mui/material/colors";
export default function ErrorBox({ title, text }) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        flexGrow: "1",
        mb: 1,
        bgcolor: red[400],
        p: 2,
      }}
    >
      <Typography component="h4" variant="h5" textAlign="center">
        {title}
      </Typography>
      {text && (
        <>
          <Divider
            sx={{
              my: 2,
            }}
          />
          <Typography component="p" textAlign="center">
            {text}
          </Typography>
        </>
      )}
    </Box>
  );
}
