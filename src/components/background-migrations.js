import React, { useState } from "react";
import flux from "@aust/react-flux";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Collapse from "@mui/material/Collapse";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import WarningIcon from "@mui/icons-material/Warning";

function BackgroundMigrations({ current, target, summary = false }) {
  const [expanded, setExpanded] = useState(false);

  const migrations = flux.backgroundMigrations.selectState("list", current, target);
  const warningCount = flux.backgroundMigrations.selectState("warningCount", current, target);

  if (migrations.length === 0) {
    return null;
  }

  if (summary) {
    return (
      <Alert severity={warningCount > 0 ? "warning" : "info"} sx={{ mt: 1 }}>
        <AlertTitle>Background Database Migrations</AlertTitle>
        <Box display="flex" alignItems="center" gap={1}>
          <Typography variant="body2">
            {migrations.length} background migration(s) will run during this upgrade
          </Typography>
          {warningCount > 0 && (
            <Chip
              icon={<WarningIcon />}
              label={`${warningCount} warnings`}
              color="warning"
              size="small"
            />
          )}
        </Box>
      </Alert>
    );
  }

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  // Individual version view
  return (
    <Container sx={{
      display: "flex",
      flex: 1,
      flexDirection: "column",
      mt: 2
    }}>
      <h2 style={{ color: "#ffa726" }}>Background Migrations</h2>

      <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
        <Typography variant="body2">
          {migrations.length} background migration(s) will run when upgrading to {target.version}
        </Typography>
        <Box display="flex" gap={1}>
          <Chip
            label={`${migrations.length} migrations`}
            color="info"
            size="small"
          />
          {warningCount > 0 && (
            <Chip
              icon={<WarningIcon />}
              label={`${warningCount} warnings`}
              color="warning"
              size="small"
            />
          )}
        </Box>
      </Box>

      {warningCount > 0 && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          <Typography variant="body2">
            {warningCount} migration(s) affect large tables and may take significant time during upgrade
          </Typography>
        </Alert>
      )}

      <Button
        variant="outlined"
        onClick={handleExpandClick}
        sx={{ mb: 2 }}
      >
        {expanded ? 'Hide' : 'Show'} migration details
      </Button>

      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <Box>
          {migrations.map((migration, index) => (
            <Accordion key={index} sx={{ mt: 1 }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Box display="flex" alignItems="center" width="100%">
                  <Box flexGrow={1}>
                    <Typography variant="subtitle2">
                      {migration.migration_class}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Version {migration.milestone} • {migration.schema} schema
                    </Typography>
                  </Box>
                  {migration.has_large_table && (
                    <Chip
                      icon={<WarningIcon />}
                      label="Large Table"
                      color="warning"
                      size="small"
                      sx={{ ml: 1 }}
                    />
                  )}
                </Box>
              </AccordionSummary>

              <AccordionDetails>
                <Box>
                  <Typography variant="body2" gutterBottom>
                    <strong>Tables affected:</strong> {migration.tables.join(', ')}
                  </Typography>

                  <Typography variant="body2" gutterBottom>
                    <strong>Migration file:</strong> {migration.filename}
                  </Typography>

                  {migration.warnings.length > 0 && (
                    <Box mt={1}>
                      <Typography variant="body2" color="warning.main" gutterBottom>
                        <strong>Warnings:</strong>
                      </Typography>
                      {migration.warnings.map((warning, wIndex) => (
                        <Alert key={wIndex} severity="warning" sx={{ mt: 1 }}>
                          <strong>{warning.table}</strong> ({warning.database} database): {warning.message}
                        </Alert>
                      ))}
                    </Box>
                  )}
                </Box>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
      </Collapse>
    </Container>
  );
}

export default BackgroundMigrations;
