import React from "react";
import Box from "@mui/material/Box";

function DistroInstall({ install }) {
  return <Box sx={style.install}>{install}</Box>;
}

export default DistroInstall;

const style = {
  install: {
    display: "flex",
    bgcolor: "grey.800",
    fontFamily: "monospace",
    fontSize: 15,
    justifyContent: "center",
    alignItems: "center",
    padding: 2,
    border: "grey.900",
    borderRadius: 1,
    minWidth: 350,
  },
};
