import React, { useState } from "react";
import flux from "@aust/react-flux";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import AssignmentIcon from "@mui/icons-material/Assignment";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Fab from "@mui/material/Fab";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import AlertTitle from "@mui/material/AlertTitle";
import Alert from "@mui/material/Alert";



// Local Components
import Overview from "components/overview";
import Upgrade from "components/upgrade";
import QuickLinks from "components/quick-links";
import EzLink from "util/ez_link";

function Path() {
  let current = flux.params.selectState("current");
  let upgradePath = flux.list.selectState("upgradePath");
  let downtime = flux.params.selectState("downtime");
  let patchVersion = flux.list.selectState("patchVersion");

  console.log('patchVersion', patchVersion)


  const mapVersion = { version: "map" };
  const [selectedVersion, setSelectedVersion] = useState(mapVersion);

  // Clipboard
  const [open, setOpen] = useState(false);
  const handleClick = () => {
    let textPath = upgradePath.map((x) => x.version).join(" => ");
    navigator.clipboard.writeText(textPath);
    setOpen(true);
  };

  const handleClose = (_event, _reason) => {
    setOpen(false);
  };

  const breadcrumbs = [
    <Button
      key='breadcrumb'
      variant='contained'
      sx={style.version("map" === selectedVersion.version)}
      onClick={() => setSelectedVersion(mapVersion)}
    >
      Summary
    </Button>,
    upgradePath.map((x, i) => (
      <Box key={i} sx={style.versionBox}>
        <Button
          variant='contained'
          onClick={() => setSelectedVersion(x)}
          sx={style.version(x.version === selectedVersion.version)}
        >
          {x.version}
        </Button>
      </Box>
    )),
  ];

  return (
    <Box sx={style.view}>
      <Box sx={style.fab}>
        <Fab
          size='small'
          color='primary'
          aria-label='add'
          onClick={() => flux.dispatch("sys/nav", "start")}
        >
          <ArrowBackIcon />
        </Fab>
      </Box>

      <QuickLinks />

      <Box sx={style.versionContainer}>

        <Box sx={style.versionStart}>{current.version}</Box>
        {patchVersion && <Box sx={style.versionList}>
          <Alert severity='info'>
            <AlertTitle sx={{ textAlign: "center" }}>
              This path includes a patch version that may not be needed
            </AlertTitle>

            <p>
              It is recommended to start and end on the latest patch. This ensures any upgrade path fixes are applied. <br />However, these patches are often not required.
            </p>

            <Box sx={style.patchPrompt}>Review the release notes for the first patch version</Box>
          </Alert>
        </Box>}


        <Box sx={style.versionList}>
          <Breadcrumbs
            separator={<NavigateNextIcon fontSize='small' />}
            aria-label='breadcrumb'
          >
            {breadcrumbs}
          </Breadcrumbs>
        </Box>

        <Button
          variant='contained'
          onClick={handleClick}
          sx={style.clipboardBtn}
        >
          <AssignmentIcon />
        </Button>
      </Box>


      {downtime &&
        <Box sx={{ flex: 0, display: "flex", justifyContent: "center", alignItems: "center" }}>
          <Alert severity='info'>
            <AlertTitle sx={{ textAlign: "center" }}>
              <EzLink url='https://docs.gitlab.com/ee/update/zero_downtime.html' text='Zero Downtime Selected - Each minor version required' />

            </AlertTitle>
          </Alert>
        </Box>}


      {selectedVersion && selectedVersion.version !== "map" && (
        <Upgrade selectedVersion={selectedVersion} />
      )}

      {selectedVersion && selectedVersion.version === "map" && (
        <Overview path={upgradePath} />
      )}

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

  fab: {
    position: "absolute",
    margin: 1,
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

  patchPrompt: {
    fontSize: 18,
    color: "yellow",
    textAlign: "center",
  },

  version: function (highlight = false) {
    let output = {
      fontSize: 22,
      color: "white",
      bgcolor: "grey.900",
      minWidth: 100,
      textTransform: "none",
    };

    if (highlight) {
      output.color = "yellow";
      output.border = 1;
      output.borderColor = "info.dark";
    }

    return output;
  },
};
