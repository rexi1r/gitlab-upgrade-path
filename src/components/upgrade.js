import React, { useState } from "react";
import flux from "@aust/react-flux";
import Box from "@mui/material/Box";
import DistroIcons from "components/distro-icons";
import DistroInstall from "components/distro-install";
import Button from "@mui/material/Button";
import ReactMarkdown from "react-markdown";
import AssignmentIcon from "@mui/icons-material/Assignment";
import Snackbar from "@mui/material/Snackbar";

function Upgrade({ selectedVersion = {} }) {
  let distro = flux.list.selectState("distro");
  let notes = flux.list.selectState("upgradeNotes", selectedVersion);

  // Clipboard
  const [open, setOpen] = useState(false);
  const handleClick = () => {
    // let textPath = upgradePath.map((x) => x.version).join(" => ");
    navigator.clipboard.writeText(version());
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    setOpen(false);
  };

  function version() {
    switch (distro) {
      case "ubuntu":
        return `apt-get install gitlab-ee=${selectedVersion.version}-ee.0`;
      case "centos":
        return `yum install gitlab-ee=${selectedVersion.version}-ee.0`;
      case "docker":
        return `docker run gitlab-ee=${selectedVersion.version}-ee.0`;
      default:
        return "";
    }
  }

  return (
    <Box sx={style.box}>
      <Box sx={style.installBox}>
        <DistroIcons distro={distro} />
        <DistroInstall selectedVersion={selectedVersion} distro={distro} />
        {selectedVersion.blog}
        <Button
          variant='contained'
          onClick={handleClick}
          sx={style.clipboardBtn}
        >
          <AssignmentIcon />
        </Button>
      </Box>

      {notes.blog && (
        <Box sx={{ padding: 1 }}>
          <Button
            variant='contained'
            color='success'
            target='_blank'
            href={notes.blog}
          >
            {selectedVersion.major}.{selectedVersion.minor} Release Notes
          </Button>
        </Box>
      )}

      {notes.notes && (
        <Box sx={{ flex: 1, padding: 4, bgcolor: "grey.900" }}>
          <ReactMarkdown>{notes.notes}</ReactMarkdown>
        </Box>
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

export default Upgrade;

const style = {
  box: {
    display: "flex",
    flex: 1,
    alignItems: "center",
    flexDirection: "column",
    overflowY: "auto",
  },

  installBox: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 1,
    margin: 1,
    opacity: 0.8,
  },

  clipboardBtn: {
    marginLeft: 1,
    alignSelf: "center",
  },
};
