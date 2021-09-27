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
import VersionList from "util/all";

const filterOptions = createFilterOptions({
  matchFrom: "start",
  stringify: (option) => option.version,
});

export default function Start() {
  let targets = flux.list.selectState("list"); // Collect Versions

  const [distro, setDistro] = useState("ubuntu");
  const handleDistro = (event) => setDistro(event.target.value);

  const [current, setCurrent] = useState();
  const [target, setTarget] = useState(targets[0]);

  async function buildPath() {
    await flux.dispatch("list/update", {
      current: current,
      target: target,
      distro: distro,
    });

    flux.dispatch("sys/update", { status: "path" });
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch",
        justifyContent: "center",
        height: "100vh",
      }}
    >
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

      <Box
        sx={{
          flex: 2,
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
          width: "80vw",
          margin: "auto",
        }}
      >
        <Autocomplete
          disablePortal
          id='combo-box-demo'
          options={VersionList}
          sx={{ flex: 1, margin: 1 }}
          groupBy={(option) => option.major}
          getOptionLabel={(option) => option.version}
          filterOptions={filterOptions}
          renderInput={(params) => <TextField {...params} label='Current' />}
          onChange={(event, newValue) => {
            setCurrent(newValue);
          }}
          autoHighlight
        />

        <Autocomplete
          disablePortal
          id='combo-box-demo'
          options={targets}
          groupBy={(option) => option.major}
          sx={{ flex: 1, margin: 1 }}
          getOptionLabel={(option) => option.version}
          filterOptions={filterOptions}
          renderInput={(params) => <TextField {...params} label='Target' />}
          onChange={(event, newValue) => {
            setTarget(newValue);
          }}
          autoHighlight
        />
      </Box>

      <Box
        sx={{
          flex: 2,
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
          width: "80vw",
          margin: "auto",
        }}
      >
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

      <Box
        sx={{
          flex: 3,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Button
          color='info'
          variant='contained'
          size='large'
          onClick={buildPath}
        >
          Go!
        </Button>
      </Box>
    </Box>
  );
}
