import React from "react";
import flux from "@aust/react-flux";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// Local Components
import Upgrade from "components/upgrade";
import DistroIcons from "components/distro-icons";

function Overview({ path }) {
  let current = flux.list.useState("current");
  let target = flux.list.useState("target");
  let distro = flux.list.useState("distro");

  let whatsNewUrl = `https://gitlab-com.gitlab.io/cs-tools/gitlab-cs-tools/what-is-new-since/?tab=features&minVersion=${current.whatsnew}&maxVersion=${target.whatsnew}`;

  return (
    <Box sx={style.view}>
      <Box sx={style.links}>
        <Button
          sx={style.btn}
          startIcon={<FontAwesomeIcon icon={["fab", "gitlab"]} size='lg' />}
          onClick={() =>
            window.open(
              "https://docs.gitlab.com/ee/update/#upgrade-paths",
              "_blank"
            )
          }
          variant='contained'
        >
          Official Upgrade Path Docs
        </Button>

        <Button
          sx={style.btn}
          startIcon={<FontAwesomeIcon icon={["far", "star"]} size='lg' />}
          onClick={() => window.open(whatsNewUrl, "_blank")}
          variant='contained'
        >
          <Box sx={style.column}>
            <span>Whats New</span>
            <span style={style.subtext}>
              {current.display} &gt; {target.display}
            </span>
          </Box>
        </Button>
      </Box>

      <Box sx={style.versions}>
        <Box sx={style.icon}>
          <DistroIcons distro={distro} />
        </Box>
        {path &&
          path.map((version) => (
            <Upgrade
              key={version.display}
              showRelease={false}
              showNotes={false}
              showIcon={false}
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

  subtext: {
    fontSize: 12,
    marginLeft: 5,
  },

  icon: {
    marginTop: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
};
