import Link from "@mui/material/Link";

function EzLink({ url = "", text = "" }) {
  return (
    <Link target='_blank' rel='noreferrer' underline='hover' href={url}>
      {text}
    </Link>
  );
}

export default EzLink;
