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
import WhatsDeprecated from "components/whats-deprecated";
import ReleaseNotes from "components/release-notes";
import UpgradeDeprecations from "components/upgrade-deprecations";
import UpgradeNotes from "components/upgrade-notes";
import Comments from "components/comments";
import CheckMigrations from "components/check-migrations";
import Alerts from "components/alerts";

function Upgrade({
  selectedVersion = {},
  showRelease = true,
  showComments = true,
  showAlerts = true,
  showIcon = true,
  showNew = true,
  showUpgradeNotes = true,
  showUpgradeDeprecations = true,
  showCheckMigrations = true,
}) {
  let distro = flux.params.useState("distro");
  let edition = flux.params.useState("edition");
  let auto = flux.params.selectState("shouldAuto");
  let current = flux.list.selectState("PreviousVersion", selectedVersion);

  // Clipboard
  const [open, setOpen] = useState(false);
  const handleClick = () => {
    navigator.clipboard.writeText(version());
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  function version() {
    switch (distro) {
      case "ubuntu":
        return `apt-get install${auto} gitlab-${edition}=${selectedVersion.version}-${edition}.0`;
      case "centos":
        return `yum install${auto} gitlab-${edition}-${selectedVersion.version}`;
      case "docker":
        return `docker run gitlab/gitlab-${edition}:${selectedVersion.version}-${edition}.0`;
      default:
        return "";
    }
  }

  return (
    <Box sx={style.box}>
      {showAlerts && <Alerts version={selectedVersion} />}
      {showComments && <Comments version={selectedVersion} />}

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

      <Box>
        {showRelease && <ReleaseNotes version={selectedVersion} />}

        {showNew && (
          <WhatsNew
            current={flux.list.selectState("PreviousVersion", selectedVersion)}
            target={selectedVersion}
          />
        )}

        {showNew && (
          <WhatsDeprecated
            current={flux.list.selectState("PreviousVersion", selectedVersion)}
            target={selectedVersion}
          />
        )}
      </Box>

      {showCheckMigrations && <CheckMigrations />}

      {showUpgradeNotes && <UpgradeNotes version={selectedVersion} />}

      {showUpgradeDeprecations && (
        <UpgradeDeprecations current={current} target={selectedVersion} />
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
