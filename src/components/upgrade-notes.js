import React from "react";
import flux from "@aust/react-flux";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import ReactMarkdown from "react-markdown";

function UpgradeNotes({ version }) {
  let notes = flux.notes.selectState(
    "notes",
    `${version.major}_${version.minor}`
  );

  return (
    <Container sx={style.view}>
      {notes &&
        notes.map((x, i) => (
          <Box key={i} sx={style.note}>
            <ReactMarkdown children={x} />
          </Box>
        ))}
    </Container>
  );
}

export default UpgradeNotes;

const style = {
  view: {
    display: "flex",
    flex: 1,
    flexDirection: "column",
  },

  note: {
    overflowWrap: "break-word",
    maxWidth: "100%",
  },
};
