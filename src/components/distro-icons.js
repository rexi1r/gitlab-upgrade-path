import React from "react";
import Box from "@mui/material/Box";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
function DistroIcons({ distro }) {
  return (
    <Box sx={{ padding: 0.5, fontSize: 28, color: "grey.600" }}>
      {distro === "docker" && (
        <FontAwesomeIcon icon={["fab", "docker"]} size={"lg"} />
      )}
      {distro === "alma" && (
        <FontAwesomeIcon icon={["fab", "centos"]} size={"lg"} />
      )}

      {distro === "ubuntu" && (
        <FontAwesomeIcon icon={["fab", "ubuntu"]} size={"lg"} />
      )}
    </Box>
  );
}

export default DistroIcons;
