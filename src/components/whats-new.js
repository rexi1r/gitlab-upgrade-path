import React from "react";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { padStart } from "lodash";

function WhatsNew({ current, target }) {
  console.log("current", current);
  console.log("target", target);

  function whats(version) {
    let major = `${padStart(version.major, 2, 0)}`;
    let minor = `${padStart(version.minor, 2, 0)}`;
    return `${major}_${minor}`;
  }

  // Add Display Helpers / WhatsNew
  function display(version) {
    return `${version.major}.${version.minor}`;
  }

  let url = "gitlab-com.gitlab.io/cs-tools/gitlab-cs-tools/what-is-new-since";
  let whatsNewUrl = `https://${url}/?tab=features&minVersion=${whats(
    current
  )}&maxVersion=${whats(target)}`;

  return (
    <a href={whatsNewUrl} target='_blank' rel='noreferrer'>
      <Button
        sx={style.btn}
        startIcon={<FontAwesomeIcon icon={["far", "star"]} size='lg' />}
        variant='contained'
      >
        <Box>
          <span>Whats New</span>
          <span style={style.subtext}>
            {display(current)} &gt; {display(target)}
          </span>
        </Box>
      </Button>
    </a>
  );
}

export default WhatsNew;

const style = {
  subtext: {
    fontSize: 12,
    marginLeft: 5,
  },
};
