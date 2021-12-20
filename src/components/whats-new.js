import React from "react";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function WhatsNew({ current, target }) {
  let whatsNewUrl = `https://gitlab-com.gitlab.io/cs-tools/gitlab-cs-tools/what-is-new-since/?tab=features&minVersion=${current.whatsnew}&maxVersion=${target.whatsnew}`;

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
            {current.display} &gt; {target.display}
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
