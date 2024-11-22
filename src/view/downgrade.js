import React from "react";
import flux from "@aust/react-flux";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Fab from "@mui/material/Fab";


function Downgrade() {
  let current = flux.params.selectState("current");
  let target = flux.params.selectState("target");


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


      <Box sx={style.versionContainer}>
        <FontAwesomeIcon icon={["fas", "triangle-exclamation"]} style={style.icon} />
        <Box sx={style.body}>
          <h1 style={{ color: 'yellow' }}>Downgrade Warning</h1>
          <h2>You have selected a downgrade from <span style={style.version}>
            {current.version}</span> to <span style={style.version}>{target.version}</span></h2>
          <Box>
          </Box>

        </Box>
      </Box>


      <Box sx={style.body}>


        <h2>Direct downgrades are not supported!</h2>
        <p style={{ fontSize: 22 }}>Additional steps are required to successfully downgrade to a previous version. This will also typically require a full restore from backup.</p>



        <p style={{ fontSize: 22 }}>Please refer to the documentation for more information and specific steps.</p>
        <a
          href={
            "https://docs.gitlab.com/ee/update/package/downgrade.html"
          }
          target='_blank'
          rel='noreferrer'
          style={style.box}
        >
          <Button
            sx={style.btn}
            startIcon={
              <FontAwesomeIcon icon={["fab", "gitlab"]} size='lg' />
            }
            variant='contained'
            color='warning'
          >
            Downgrade Documentation
          </Button>
        </a>
      </Box>
    </Box >
  );
}

export default Downgrade;

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

  alert: {
    fontSize: 22,
  },

  icon: {
    color: 'red',
    fontSize: 64
  },

  version: {
    color: 'yellow',
    fontSize: 28,
  },

  body: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
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

};
