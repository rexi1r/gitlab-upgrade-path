import React from "react";
import flux from "@aust/react-flux";
import Box from "@mui/material/Box";
import DistroIcons from "components/distro-icons";
import DistroInstall from "components/distro-install";
import Button from "@mui/material/Button";
import ReactMarkdown from "react-markdown";

function Upgrade({ selectedVersion = {} }) {
  let distro = flux.list.selectState("distro");
  let notes = flux.list.selectState("upgradeNotes", selectedVersion);

  console.log("selected", selectedVersion);
  console.log("notes", notes);

  return (
    <Box sx={style.box}>
      <Box sx={style.installBox}>
        <DistroIcons distro={distro} />
        <DistroInstall selectedVersion={selectedVersion} distro={distro} />
        {selectedVersion.blog}
      </Box>

      {notes.blog && (
        <Box sx={{ padding: 1 }}>
          <Button
            variant='contained'
            color='success'
            target='_blank'
            href={notes.blog}
          >
            {selectedVersion.major}.{selectedVersion.minor} Release Notes
          </Button>
        </Box>
      )}

      {notes.notes && (
        <Box sx={{ flex: 1, padding: 4, bgcolor: "grey.900" }}>
          <ReactMarkdown>{notes.notes}</ReactMarkdown>
        </Box>
      )}
    </Box>
  );
}

export default Upgrade;

const style = {
  box: {
    display: "flex",
    flex: 1,
    // justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    overflowY: "auto",
  },

  installBox: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",

    // bgcolor: "background.paper",
    // border: 1,
    // borderColor: "info.dark",
    // borderRadius: 1,
    padding: 1,
    margin: 1,
    opacity: 0.8,
  },
};
