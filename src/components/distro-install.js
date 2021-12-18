import React from "react";
import Box from "@mui/material/Box";

function DistroInstall({ distro, selectedVersion, edition, auto }) {
  return (
    <Box sx={style.install}>
      {distro === "ubuntu" && (
        <div>
          apt-get install {auto} gitlab-{edition}={selectedVersion.version}-
          {edition}.0
        </div>
      )}
      {distro === "centos" && (
        <div>
          yum install {auto} gitlab-{edition}={selectedVersion.version}-
          {edition}.0.el8
        </div>
      )}
      {distro === "docker" && (
        <div>
          docker run gitlab-{edition}={selectedVersion.version}-{edition}.0
        </div>
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
    fontSize: 15,
    justifyContent: "center",
    alignItems: "center",
    padding: 2,
    border: "grey.900",
    borderRadius: 1,
    minWidth: 350,
  },
};
