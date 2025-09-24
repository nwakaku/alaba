import React from "react";

type ImgProps = React.ImgHTMLAttributes<HTMLImageElement> & {
  src: string;
  alt: string;
  width?: number | string;
  height?: number | string;
};

const Image: React.FC<ImgProps> = ({ width, height, ...rest }) => {
  const style: React.CSSProperties = {
    width: typeof width === "number" ? `${width}px` : width,
    height: typeof height === "number" ? `${height}px` : height,
    objectFit: "contain",
    ...(rest.style || {}),
  };
  return <img {...rest} style={style} />;
};

export default Image;


