import React from "react";
import Button from "@mui/material/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function CheckMigrations() {
  return (
    <a
      href={
        "https://docs.gitlab.com/ee/update/index.html#check-for-background-migrations-before-upgrading"
      }
      target='_blank'
      rel='noreferrer'
      style={style.box}
    >
      <Button
        sx={style.btn}
        startIcon={
          <FontAwesomeIcon icon={["fas", "triangle-exclamation"]} size='lg' />
        }
        variant='contained'
        color='warning'
      >
        Check Background Migrations before each upgrade
      </Button>
    </a>
  );
}

export default CheckMigrations;

const style = {
  btn: {
    margin: 1,
  },

  icon: {
    marginTop: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
};
