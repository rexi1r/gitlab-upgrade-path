import React, { useState } from "react";
import flux from "@aust/react-flux";
import { reverse } from "lodash";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import AssignmentIcon from "@mui/icons-material/Assignment";
import Upgrade from "components/upgrade";

function Path() {
  let current = flux.list.selectState("current");
  let upgradePath = flux.list.selectState("upgradePath");

  const [selectedVersion, setSelectedVersion] = useState(null);

  // Clipboard
  const [open, setOpen] = useState(false);
  const handleClick = () => {
    let textPath = upgradePath.map((x) => x.version).join(" => ");
    navigator.clipboard.writeText(textPath);
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    setOpen(false);
  };

  let currentStyle = {};
  if (selectedVersion) {
    currentStyle[selectedVersion.version] = {
      color: "yellow",
      border: 1,
      borderColor: "info.dark",
    };
  }

  return (
    <Box sx={style.view}>
      <Box sx={style.versionContainer}>
        <Box sx={style.versionStart}>{current.version}</Box>

        <Box sx={style.versionList}>
          {reverse(upgradePath).map((x, i) => (
            <Box key={x.version} sx={style.versionBox}>
              <Button
                variant='contained'
                onClick={() => setSelectedVersion(x)}
                sx={{ ...style.version, ...currentStyle[x.version] }}
              >
                {x.version}
              </Button>
            </Box>
          ))}
        </Box>

        <Button
          variant='contained'
          onClick={handleClick}
          sx={style.clipboardBtn}
        >
          <AssignmentIcon />
        </Button>
      </Box>

      {selectedVersion && <Upgrade selectedVersion={selectedVersion} />}

      <Snackbar
        open={open}
        autoHideDuration={2000}
        onClose={handleClose}
        message='Copied to Clipboard!'
      />
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

  clipboardBtn: {
    alignSelf: "flex-end",
  },

  versionList: {
    flex: 1,
    display: "flex",
    flexWrap: "wrap",
    padding: 2,
    justifyContent: "center",
    alignItems: "center",
  },

  versionBox: {
    margin: 1,
    marginBottom: 1,
  },

  versionIcon: {
    flex: 1,
    textAlign: "center",
  },

  version: {
    fontSize: 22,
    color: "white",
    bgcolor: "grey.900",
    minWidth: 100,
  },
};
