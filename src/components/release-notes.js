import React from "react";
import flux from "@aust/react-flux";
import Button from "@mui/material/Button";

function ReleaseNotes({ version }) {
  let release = flux.list.selectState("ReleaseBlog", version);
  return (
    <a href={release} target='_blank' rel='noreferrer'>
      <Button sx={style.btn} variant='contained' color='success'>
        Release Notes
      </Button>
    </a>
  );
}

export default ReleaseNotes;

const style = {
  btn: {
    margin: 1,
  },
};
