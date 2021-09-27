import React, { useState } from "react";
import flux from "@aust/react-flux";
import { reverse } from "lodash";
import Box from "@mui/material/Box";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import Upgrade from "components/upgrade";

function Path() {
  let current = flux.list.selectState("current");
  let upgradePath = flux.list.selectState("upgradePath");

  const [selectedVersion, setSelectedVersion] = useState(null);

  return (
    <Box sx={style.view}>
      <Box sx={style.versionContainer}>
        <Box sx={style.versionStart}>{current.version}</Box>

        <Box sx={style.versionList}>
          {reverse(upgradePath).map((x, i) => (
            <Box key={x.version} sx={style.versionBox}>
              <Box onClick={() => setSelectedVersion(x)} sx={style.version}>
                {x.version}
              </Box>
              {i + 1 < upgradePath.length && <ArrowForwardIosIcon />}
              {i + 1 === upgradePath.length && <CheckCircleIcon />}
            </Box>
          ))}
        </Box>
      </Box>

      {selectedVersion && <Upgrade selectedVersion={selectedVersion} />}
    </Box>
  );
}

export default Path;

const style = {
  view: {
    display: "flex",
    flexDirection: "column",
    alignItems: "stretch",
    height: "100vh",
  },

  versionContainer: {
    display: "flex",
    flexDirection: "column",
    alignSelf: "center",
    alignItems: "stretch",
    justifyContent: "center",
    width: "80%",
    bgcolor: "background.paper",
    borderRadius: 1,
    padding: 1,
    margin: 1,
  },

  versionStart: {
    display: "flex",
    bgcolor: "grey.900",
    justifyContent: "center",
    color: "grey.600",
    padding: 0.5,
    opacity: 0.7,
  },

  versionList: {
    flex: 1,
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "space-around",
    padding: 2,
  },

  versionBox: {
    display: "flex",
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",

    margin: 0.15,
  },

  version: {
    fontSize: 24,
    fontWeight: 500,
    border: 1,
    padding: 1,
    paddingRight: 2,
    paddingLeft: 2,
    borderColor: "info.dark",
    bgcolor: "grey.900",
    borderRadius: 2,
    textAlign: "center",
    minWidth: 100,
  },
};
