import React from "react";
import flux from "@aust/react-flux";
import { createFilterOptions } from "@mui/material/Autocomplete";
import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
import Image from "util/image";
import Link from "@mui/material/Link";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Checkbox from "@mui/material/Checkbox";
import Alert from "@mui/material/Alert";

import { styled } from "@mui/material/styles";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";

// Local Components
import VersionList from "util/all";

// Downgrade Check
const semver = require("semver");

const filterOptions = createFilterOptions({
  matchFrom: "start",
  stringify: (option) => option.version,
});

const CustomTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))({
  [`& .${tooltipClasses.tooltip}`]: {
    fontSize: 25,
    maxWidth: 500,
    padding: 15,
  },
});

export default function Start() {
  let targets = flux.list.useState("targets"); // Collect Versions
  let distro = flux.params.useState("distro"); // Starting Version
  let edition = flux.params.useState("edition"); // EE / CE
  let auto = flux.params.useState("auto"); // -y install flag
  let downtime = flux.params.useState("downtime"); // Skip minor versions
  let current = flux.params.useState("current"); // Starting Version
  let target = flux.params.useState("target"); // Target Version
  let n1 = flux.params.useState("n1"); // Adjust Target Version

  async function buildPath() {
    if (!current) return false;

    if (semver.lt(target.version, current.version)) {
      flux.dispatch("sys/nav", "downgrade");
    } else {
      flux.dispatch("sys/nav", "path");
    }

  }

  return (
    <Box sx={style.view}>
      <Box sx={{ flex: 3 }}>
        <Image src={"gitlab-icon.svg"} />
      </Box>

      <Box
        sx={{
          flex: 1,
          textAlign: "center",
        }}
      >
        <Typography variant='h4' component='div' gutterBottom>
          Upgrade Path
        </Typography>

        <CustomTooltip
          title='grep gitlab /opt/gitlab/version-manifest.txt'
          leaveDelay={400}
        >
          <Link
            target='_blank'
            rel='noreferrer'
            underline='hover'
            href={"https://docs.gitlab.com/ee/user/version.html"}
          >
            <div>Select Versions</div>
          </Link>
        </CustomTooltip>
      </Box>

      <Box sx={style.autoBox}>
        <Autocomplete
          disablePortal
          defaultValue={current}
          options={VersionList.index.slice(1, VersionList.index.length)}
          sx={style.auto}
          groupBy={(option) => option.major}
          getOptionLabel={(option) => option.version}
          filterOptions={filterOptions}
          renderInput={(params) => <TextField {...params} label='Current' />}
          onChange={(e, v) => flux.dispatch("params/current", v)}
          autoHighlight
        />

        <Autocomplete
          disablePortal
          disabled={n1 === "true" || n1}
          options={targets}
          defaultValue={target}
          groupBy={(option) => option.major}
          sx={style.auto}
          getOptionLabel={(option) => option.version}
          filterOptions={filterOptions}
          renderInput={(params) => <TextField {...params} label='Target' />}
          onChange={(e, v) => flux.dispatch("params/target", v)}
          autoHighlight
        />
      </Box>

      <Box sx={style.options}>
        <Box sx={style.choices}>
          <FormControl component='fieldset'>
            <FormLabel component='legend'>Edition</FormLabel>
            <RadioGroup
              aria-label='edition'
              defaultValue={edition}
              name='radio-buttons-group'
              onChange={(e) => flux.dispatch("params/edition", e)}
            >
              <FormControlLabel
                value='ee'
                control={<Radio />}
                label='Enterprise'
              />
              <FormControlLabel
                value='ce'
                control={<Radio />}
                label='Community'
              />
            </RadioGroup>
          </FormControl>
        </Box>

        <Box sx={style.choices}>
          <FormControl component='fieldset'>
            <FormLabel component='legend'>Distro</FormLabel>
            <RadioGroup
              aria-label='distro'
              defaultValue={distro}
              name='radio-buttons-group'
              onChange={(e) => flux.dispatch("params/distro", e)}
            >
              <FormControlLabel
                value='ubuntu'
                control={<Radio />}
                label='Ubuntu'
              />
              <FormControlLabel
                value='centos'
                control={<Radio />}
                label='CentOS'
              />
              <FormControlLabel
                value='docker'
                control={<Radio />}
                label='Docker'
              />
            </RadioGroup>
          </FormControl>
        </Box>

        <Box sx={style.choices}>
          <Tooltip
            title='Add -y on install commands'
            placement='top-start'
            arrow
          >
            <FormControl component='fieldset'>
              <FormControlLabel
                control={
                  <Checkbox
                    onChange={(e) => flux.dispatch("params/auto", !auto)}
                    checked={auto === "true" || auto}
                    inputProps={{ "aria-label": "controlled" }}
                  />
                }
                label='Auto Install'
              />
            </FormControl>
          </Tooltip>

          <Tooltip title='Select all minor versions' arrow>
            <FormControl component='fieldset'>
              <FormControlLabel
                control={
                  <Checkbox
                    onChange={(e) =>
                      flux.dispatch("params/downtime", !downtime)
                    }
                    checked={downtime === "true" || downtime}
                    inputProps={{ "aria-label": "controlled" }}
                  />
                }
                label='Zero downtime'
              />
            </FormControl>
          </Tooltip>

          <Tooltip title='Assume second to last is latest release' arrow>
            <FormControl component='fieldset'>
              <FormControlLabel
                control={
                  <Checkbox
                    onChange={(e) => flux.dispatch("params/n1", !n1)}
                    checked={n1 === "true" || n1}
                    inputProps={{ "aria-label": "controlled" }}
                  />
                }
                label='N-1'
              />
            </FormControl>
          </Tooltip>
        </Box>
      </Box>

      <Box sx={style.go}>
        <Button
          color='info'
          variant='contained'
          size='large'
          onClick={buildPath}
          disabled={!current || !target}
        >
          Go!
        </Button>
      </Box>

      <Box sx={style.comment}>
        <Box sx={style.autoBox}>
          <Alert severity='info' sx={{ marginBottom: 1 }}>
            This assumes a default conservative approach. You may not need every
            step.
          </Alert>
        </Box>
      </Box>
    </Box>
  );
}

const style = {
  view: {
    display: "flex",
    flexDirection: "column",
    alignItems: "stretch",
    justifyContent: "center",
    height: "100vh",
  },

  comment: {
    position: "fixed",
    bottom: 0,
    left: 0,
    width: "100vw",
  },

  autoBox: {
    flex: 2,
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
    width: "80vw",
    margin: "auto",
  },

  auto: {
    flex: 1,
    margin: 1,
  },

  options: {
    flex: 2,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    width: "80vw",
    margin: "auto",
  },

  choices: {
    display: "flex",
    flexDirection: "column",
    marginLeft: 5,
    marginRight: 5,
  },

  go: {
    flex: 3,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
};
