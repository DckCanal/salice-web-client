import StyledPaper from "./StyledPaper";
export default function FormPaper(params) {
  return (
    <StyledPaper
      {...params}
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        minWidth: 600,
        padding: 3,
        margin: 3,
      }}
    />
  );
}
