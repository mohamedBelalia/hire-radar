import { CircularProgress } from "@mui/material";
import { Box } from "@mui/system";

export const Loading = () => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh", 
        width: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.1)", 
        position: "fixed", 
        top: 0,
        left: 0,
        zIndex: 9999,
      }}
    >
      <CircularProgress
        size={60}
        thickness={4}
        sx={{
          color: (theme) => theme.palette.primary.main, 
          animationDuration: "800ms",
        }}
      />
      <br />
    </Box>
  );
};