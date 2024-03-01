import React from "react";
import flux from "@aust/react-flux";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { padStart } from "lodash";

function Deprecations({ current, target }) {
  let relative = flux.list.selectState("WhatsNewRelative", current);

  function whats(version) {
    let major = `${padStart(version.major, 2, 0)}`;
    let minor = `${padStart(version.minor, 2, 0)}`;
    return `${major}.${minor}`;
  }

  // Add Display Helpers / WhatsNew
  function display(version) {
    return `${version.major}.${version.minor}`;
  }

  let url = "gitlab-com.gitlab.io/cs-tools/gitlab-cs-tools/what-is-new-since";
  let whatsNewUrl = `https://${url}/?tab=deprecations&minRemovalVersion=${whats(
    relative
  )}&maxRemovalVersion=${whats(target)}`;

  // Only show one version if there is only one jump between versions
  let displayText = `${display(relative)} > ${display(target)}`;
  if (relative.version === target.version) {
    displayText = display(relative);
  }

  return (
    <a href={whatsNewUrl} target='_blank' rel='noreferrer'>
      <Button
        sx={style.btn}
        color='warning'
        startIcon={
          <FontAwesomeIcon icon={["fas", "arrow-trend-down"]} size='xs' />
        }
        variant='contained'
      >
        <Box>
          <span>Deprecations</span>
          <span style={style.subtext}>{displayText}</span>
        </Box>
      </Button>
    </a>
  );
}

export default Deprecations;

const style = {
  btn: {
    margin: 1,
  },
  subtext: {
    fontSize: 12,
    marginLeft: 5,
  },
};
