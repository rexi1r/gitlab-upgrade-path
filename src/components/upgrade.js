import React, { useState } from "react";
import flux from "@aust/react-flux";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import AssignmentIcon from "@mui/icons-material/Assignment";
import Snackbar from "@mui/material/Snackbar";

// Local Components
import DistroIcons from "components/distro-icons";
import DistroInstall from "components/distro-install";
import WhatsNew from "components/whats-new";
import ReleaseNotes from "components/release-notes";
import UpgradeNotes from "components/upgrade-notes";
import Comments from "components/comments";

function Upgrade({
  selectedVersion = {},
  showRelease = true,
  showComments = true,
  showIcon = true,
  showNew = true,
  showUpgradeNotes = true,
}) {
  let distro = flux.list.useState("distro");
  let edition = flux.list.useState("edition");
  let auto = flux.list.selectState("shouldAuto");

  // Clipboard
  const [open, setOpen] = useState(false);
  const handleClick = () => {
    navigator.clipboard.writeText(version());
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    setOpen(false);
  };

  function version() {
    switch (distro) {
      case "ubuntu":
        return `apt-get install ${auto} gitlab-${edition}=${selectedVersion.version}-${edition}.0`;
      case "centos":
        return `yum update ${auto} gitlab-${edition}-${selectedVersion.version}`;
      case "docker":
        return `docker run gitlab-${edition}=${selectedVersion.version}-${edition}.0`;
      default:
        return "";
    }
  }

  return (
    <Box sx={style.box}>
      <Box sx={style.installBox}>
        {showIcon && <DistroIcons distro={distro} />}
        <DistroInstall
          selectedVersion={selectedVersion}
          distro={distro}
          edition={edition}
          auto={auto}
          install={version()}
        />
        <Button
          variant='contained'
          onClick={handleClick}
          sx={style.clipboardBtn}
        >
          <AssignmentIcon />
        </Button>
      </Box>

      {showRelease && <ReleaseNotes version={selectedVersion} />}

      {showNew && (
        <WhatsNew
          current={flux.list.selectState("WhatsNewRelative", selectedVersion)}
          target={selectedVersion}
        />
      )}

      {showComments && <Comments version={selectedVersion} />}

      {showUpgradeNotes && <UpgradeNotes version={selectedVersion} />}

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
