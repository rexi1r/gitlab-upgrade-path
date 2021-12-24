import React from "react";
import flux from "@aust/react-flux";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// Local Components
import Upgrade from "components/upgrade";
import DistroIcons from "components/distro-icons";
import WhatsNew from "components/whats-new";

function Overview({ path }) {
  let current = flux.list.useState("current");
  let target = flux.list.useState("target");
  let distro = flux.list.useState("distro");

  return (
    <Box sx={style.view}>
      <Box sx={style.links}>
        <a
          href={"https://docs.gitlab.com/ee/update/#upgrade-paths"}
          target='_blank'
          rel='noreferrer'
        >
          <Button
            sx={style.btn}
            startIcon={<FontAwesomeIcon icon={["fab", "gitlab"]} size='lg' />}
            variant='contained'
            color='success'
          >
            Upgrade Path Docs
          </Button>
        </a>

        <WhatsNew current={current} target={target} />
      </Box>

      <Box sx={style.versions}>
        <Box sx={style.icon}>
          <DistroIcons distro={distro} />
        </Box>
        {path &&
          path.map((version, i) => (
            <Upgrade
              key={i}
              showRelease={false}
              showComments={false}
              showIcon={false}
              showNew={false}
              showUpgradeNotes={false}
              selectedVersion={version}
            />
          ))}
      </Box>
    </Box>
  );
}

export default Overview;

const style = {
  view: {
    flex: 1,
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    flexDirection: "column",
    padding: 1,
    overflowY: "auto",
  },

  btn: {
    margin: 0.5,
  },

  icon: {
    marginTop: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
};
