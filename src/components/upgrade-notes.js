import React from "react";
import flux from "@aust/react-flux";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import ReactMarkdown from "react-markdown";

function VersionNotes({ name, notes }) {
  return (
    <div>
      <strong>{name}</strong>
      {notes &&
        notes.map((x, i) => (
          <Box key={i} sx={style.note}>
            <ReactMarkdown children={x} />
          </Box>
        ))}
    </div>
  );
}

function UpgradeNotes({ version }) {
  let list = flux.notes.selectState("list", version);

  // Do not return anything if list is empty
  if (!list || list.length === 0) return null;

  return (
    <Container sx={style.view}>
      <h2 style={{ color: "#66bb6a" }}>Release Notes</h2>
      {list && list.map((x) => <VersionNotes key={x.name} {...x} />)}
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
