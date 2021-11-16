import React from "react";
import Box from "@mui/material/Box";

function DistroInstall({ distro, selectedVersion }) {
  return (
    <Box sx={style.install}>
      {distro === "ubuntu" && (
        <div>apt-get install gitlab-ee={selectedVersion.version}-ee.0</div>
      )}
      {distro === "centos" && (
        <div>yum install gitlab-ee={selectedVersion.version}-ee.0.el8</div>
      )}
      {distro === "docker" && (
        <div>docker run gitlab-ee={selectedVersion.version}-ee.0</div>
      )}
    </Box>
  );
}

export default DistroInstall;

const style = {
  install: {
    display: "flex",
    bgcolor: "grey.800",
    fontFamily: "monospace",
    fontSize: 16,
    justifyContent: "center",
    alignItems: "center",
    padding: 2,
    border: "grey.900",
    borderRadius: 1,
  },
};
