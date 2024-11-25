import React from "react";
import flux from "@aust/react-flux";
import Box from "@mui/material/Box";
import ReactMarkdown from "react-markdown";
import Container from "@mui/material/Container";
import { Alert, AlertTitle } from "@mui/material";

function AlertMessage({ severity, title, message }) {
  return (
    <Alert severity={severity} sx={style.alert}>
      <AlertTitle>{title}</AlertTitle>
      <Box sx={style.body}>
        <ReactMarkdown children={message} style={style.message} />
      </Box>
    </Alert>
  );
}


function Alerts({ version, summary = false, current, target }) {

  let alerts;

  if (summary) {
    alerts = flux.list.useState("upgradeSummaryAlerts", current, target);
  } else {
    alerts = flux.list.useState("upgradeAlerts", version);
  }


  // If Alerts empty or missing return false
  if (!alerts) return false;
  if (alerts.length === 0) return false;


  return (
    <Container style={style.view}>
      {alerts && alerts.map((x) => <AlertMessage key={x.message} {...x} />)}
    </Container>
  );
}

export default Alerts;



const style = {

  view: {
    paddingLeft: 2,
    paddingRight: 2,
    marginTop: '0.5rem',
    marginBottom: '1em'
  },

  alert: {
    marginBottom: '0.5rem',
  },
}