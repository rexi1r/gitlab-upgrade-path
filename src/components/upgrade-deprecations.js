import React, { useState } from "react";
import flux from "@aust/react-flux";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import ReactMarkdown from "react-markdown";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Chip from "@mui/material/Chip";
import Collapse from '@mui/material/Collapse';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import IconButton from '@mui/material/IconButton';



function DocUrl({ url }) {
	return (
		<a href={url} target='_blank' rel='noreferrer'>
			<Button
				sx={style.btn}
				variant='outlined'
				color='success'
				startIcon={<FontAwesomeIcon icon={["far", "newspaper"]} size='lg' />}
			>
				Documentation
			</Button>
		</a>
	);
}

function IssueUrl({ url }) {
	return (
		<a href={url} target='_blank' rel='noreferrer'>
			<Button
				sx={style.btn}
				variant='outlined'
				color='warning'
				startIcon={
					<FontAwesomeIcon icon={["far", "calendar-check"]} size='lg' />
				}
			>
				Issue
			</Button>
		</a>
	);
}

function VersionNotes({
	title,
	body,
	documentation_url,
	issue_url,
	removal_milestone,
	breaking_change,
}) {
	return (
		<Box style={style.box}>
			<Box style={style.header}>
				<Box style={style.title}>
					<ReactMarkdown children={title} />
				</Box>

				<Chip
					style={style.chip}
					label={removal_milestone}
					variant={"outlined"}
				/>

				{breaking_change && (
					<Chip
						style={style.breaking}
						color='error'
						label={"Breaking Change"}
						variant={"contained"}
					/>
				)}
				{documentation_url && <DocUrl url={documentation_url} />}
				{issue_url && <IssueUrl url={issue_url} />}
			</Box>

			<Box sx={style.note}>
				<ReactMarkdown children={body} />
			</Box>
		</Box>
	);
}

function UpgradeDeprecations({ current, target }) {
	let list = flux.deprecations.selectState("list", current, target);

	const [expanded, setExpanded] = useState(false);

	const handleExpandClick = () => {
		setExpanded(!expanded);
	};

	// Do not return anything if list is empty
	if (!list || list.length === 0) return null;

	return (
		<Container sx={style.view}>
			<Box>
				<h2 style={{ color: "#f44336" }}>Deprecations
					<IconButton onClick={handleExpandClick}
						aria-expanded={expanded}
						aria-label="show more">
						{!expanded && <ExpandMoreIcon />}
						{expanded && <ExpandLessIcon />}
					</IconButton>
				</h2>
			</Box>


			<Collapse in={expanded} timeout={0} unmountOnExit>

				{list && list.map((x) => <VersionNotes key={x.title} {...x} />)}
			</Collapse>
		</Container>
	);
}

export default UpgradeDeprecations;

const style = {
	view: {
		display: "flex",
		flex: 1,
		flexDirection: "column",
	},
	box: {
		marginBottom: "1em",
		paddingLeft: "1em",
		paddingRight: "1em",
		paddingTop: "0.25em",
		backgroundColor: "#071318",
	},
	header: {
		display: "flex",
		flex: 1,
		flexDirection: "row",
	},

	title: {
		flex: 1,
		fontSize: 24,
		fontWeight: "bold",
	},

	chip: {
		marginTop: "0.75em",
		marginRight: "0.75em",
	},

	breaking: {
		marginTop: "0.6em",
		fontWeight: "bold",
		fontSize: 16,
	},

	note: {
		overflowWrap: "break-word",
		marginLeft: "1em", // added '10px' to 'marginLeft
		maxWidth: "100%",
	},
	btn: {
		margin: 1,
	},
};
