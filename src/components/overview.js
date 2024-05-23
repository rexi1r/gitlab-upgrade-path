import React from "react";
import flux from "@aust/react-flux";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// Local Components
import Upgrade from "components/upgrade";
import DistroIcons from "components/distro-icons";
import WhatsNew from "components/whats-new";
import WhatsDeprecated from "components/whats-deprecated";
import CheckMigrations from "components/check-migrations";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Alerts from "components/alerts";

function Overview({ path }) {
	let target = flux.params.useState("target");
	let distro = flux.params.useState("distro");

	// Start with current version
	let current = flux.params.selectState("current");
	return (
		<Box sx={style.view}>
			<Alerts summary={true} current={current} target={target} />


			<Alert severity='info' sx={{ marginBottom: 1 }}>
				<AlertTitle sx={{ textAlign: "center" }}>
					This is the supported upgrade path overview
				</AlertTitle>
				Review each step and the version specific upgrade notes
			</Alert>



			<Box>
				<a
					href={"https://docs.gitlab.com/ee/update/#upgrade-paths"}
					target='_blank'
					rel='noreferrer'
				>
					<Button
						sx={style.btn}
						startIcon={<FontAwesomeIcon icon={["fab", "gitlab"]} size='lg' />}
						variant='contained'
						color='success'
					>
						Upgrade Path Docs
					</Button>
				</a>

				<WhatsNew current={current} target={target} />
				<WhatsDeprecated current={current} target={target} />
			</Box>
			<Box sx={{ margin: 1 }}>
				<CheckMigrations />
			</Box>
			<Box sx={style.versions}>
				<Box sx={style.icon}>
					<DistroIcons distro={distro} />
				</Box>
				{path &&
					path.map((version, i) => (
						<Upgrade
							key={i}
							showRelease={false}
							showComments={false}
							showIcon={false}
							showNew={false}
							showCheckMigrations={false}
							showAlerts={false}
							showUpgradeNotes={false}
							showUpgradeDeprecations={false}
							selectedVersion={version}
						/>
					))}
			</Box>
		</Box>
	);
}

export default Overview;

const style = {
	view: {
		flex: 1,
		display: "flex",
		justifyContent: "flex-start",
		alignItems: "center",
		flexDirection: "column",
		padding: 1,
		overflowY: "auto",
	},

	btn: {
		margin: 0.5,
	},

	icon: {
		marginTop: 1,
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
	},
};
