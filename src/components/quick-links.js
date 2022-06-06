import React, { useState } from "react";

import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import HelpIcon from "@mui/icons-material/Help";
import Fab from "@mui/material/Fab";
import Link from "@mui/material/Link";

import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";

function EzLink({ url = "", text = "" }) {
  return (
    <Link target='_blank' rel='noreferrer' underline='hover' href={url}>
      {text}
    </Link>
  );
}

function QuickLinks() {
  const [state, setState] = useState(false);
  return (
    <div>
      <Box sx={style.fab}>
        <Fab
          size='small'
          color='primary'
          aria-label='add'
          onClick={() => setState(!state)}
        >
          <HelpIcon />
        </Fab>
      </Box>

      <Drawer open={state} anchor='right' onClose={() => setState(false)}>
        <div style={style.header}>Reference</div>

        <List>
          <ListItem>
            <EzLink
              url='https://docs.gitlab.com/ee/update/index.html#upgrade-paths'
              text='Upgrade Path'
            />
          </ListItem>
          <ListItem>
            <EzLink
              url='https://docs.gitlab.com/ee/update/package'
              text='Package Update'
            />
          </ListItem>

          <ListItem>
            <EzLink
              url='https://docs.gitlab.com/ee/update/index.html#checking-for-background-migrations-before-upgrading'
              text='Database Migrations'
            />
          </ListItem>

          <Divider />
          <ListItem>
            <Box>
              <small>
                Migrations should be complete before each upgrade!
                <pre>
                  <code>
                    sudo gitlab-rails runner -e production 'puts
                    Gitlab::BackgroundMigration.remaining'
                    <br /> <br />
                    sudo gitlab-rails runner -e production 'puts
                    Gitlab::BackgroundMigration.pending'
                  </code>
                </pre>
              </small>
            </Box>
          </ListItem>

          <Divider />
          <ListItem>
            <Box>
              <small>
                General Migrations Check
                <pre>
                  <code>sudo gitlab-rake db:migrate:status</code>
                </pre>
              </small>
            </Box>
          </ListItem>
        </List>
      </Drawer>
    </div>
  );
}

export default QuickLinks;

const style = {
  fab: {
    position: "absolute",
    margin: 1,
    right: 0,
    bottom: 0,
  },

  box: {
    display: "flex",
    flexDirection: "column",
    width: "20vw",
    minWidth: 250,
    // alignItems: "center",
    flex: 1,
  },

  header: {
    // display: "flex",
    // justifyContent: "center",
    textAlign: "center",
    backgroundColor: "#90caf9",
    color: "black",
    fontWeight: 400,
    fontSize: "1.5rem",
    padding: 5,
  },

  entry: {
    marginTop: 5,
    marginBottom: 5,
    padding: 5,
    textAlign: "center",
  },
};
