import React from "react";

function Image({ src = "flag", style = {}, local = true }) {
  let image = {};
  if (local) {
    image.backgroundImage = `url(${process.env.PUBLIC_URL}/images/${src})`;
  } else {
    image.backgroundImage = `url(${src})`;
  }

  return (
    <div style={{ ...defaultStyle.view, ...style.view }}>
      <div style={{ ...defaultStyle.img, ...style.img, ...image }}></div>
    </div>
  );
}

export default Image;

const defaultStyle = {
  view: {
    height: "100%",
    width: "100%",
    display: "flex",
  },
  img: {
    flex: 1,

    backgroundSize: "contain",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center center",
  },
};
