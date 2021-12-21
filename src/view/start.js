import React, { useState } from "react";
import flux from "@aust/react-flux";
import { createFilterOptions } from "@mui/material/Autocomplete";
import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
import Image from "util/image";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Checkbox from "@mui/material/Checkbox";

// Local Components
import VersionList from "util/all";

const filterOptions = createFilterOptions({
  matchFrom: "start",
  stringify: (option) => option.version,
});

export default function Start() {
  let targets = flux.list.useState("targets"); // Collect Versions

  const [distro, setDistro] = useState("ubuntu");
  const handleDistro = (event) => setDistro(event.target.value);

  const [edition, setEdition] = useState("ee");
  const handleEdition = (event) => setEdition(event.target.value);

  const [auto, setAuto] = useState(false);
  const handleAuto = () => setAuto(!auto);

  let current = flux.list.useState("current"); // Collect Versions

  const [target, setTarget] = useState(targets[0]);

  async function buildPath() {
    if (!current) return false;

    await flux.dispatch("list/update", {
      current: current,
      target: target,
      distro: distro,
      edition: edition,
      auto: auto,
    });

    flux.dispatch("sys/nav", "path");
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
        <div>Select Versions</div>
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
          onChange={(event, newValue) => {
            flux.dispatch("list/update", {
              current: newValue,
            });
          }}
          autoHighlight
        />

        <Autocomplete
          disablePortal
          options={targets}
          defaultValue={targets[0]}
          groupBy={(option) => option.major}
          sx={style.auto}
          getOptionLabel={(option) => option.version}
          filterOptions={filterOptions}
          renderInput={(params) => <TextField {...params} label='Target' />}
          onChange={(event, newValue) => {
            setTarget(newValue);
          }}
          autoHighlight
        />
      </Box>

      <Box sx={style.options}>
        <Box sx={style.choices}>
          <FormControl component='fieldset'>
            <FormLabel component='legend'>Edition</FormLabel>
            <RadioGroup
              aria-label='edition'
              defaultValue='ee'
              name='radio-buttons-group'
              onChange={handleEdition}
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
              defaultValue='ubuntu'
              name='radio-buttons-group'
              onChange={handleDistro}
            >
              <FormControlLabel
                value='ubuntu'
                control={<Radio />}
                label='Ubuntu'
              />
              <FormControlLabel
                value='centos'
                control={<Radio />}
                label='Centos'
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
          <FormControl component='fieldset'>
            <FormLabel component='legend'>Command Options</FormLabel>
            <FormControlLabel
              control={
                <Checkbox
                  onChange={handleAuto}
                  checked={auto}
                  inputProps={{ "aria-label": "controlled" }}
                />
              }
              label='Auto Install'
            />
          </FormControl>
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
