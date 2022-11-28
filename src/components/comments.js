import React from "react";
import flux from "@aust/react-flux";
import Box from "@mui/material/Box";
import ReactMarkdown from "react-markdown";

function Comments({ version }) {
  let comments = flux.list.useState("upgradeComments", version);

  if (!comments) return false;

  return (
    <Box
      sx={{
        paddingLeft: 2,
        paddingRight: 2,
        borderRadius: "0.2rem",
        backgroundColor: "rgb(7, 19, 24)",
      }}
    >
      <ReactMarkdown>{comments.comments}</ReactMarkdown>
    </Box>
  );
}

export default Comments;
