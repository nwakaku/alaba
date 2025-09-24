import React from "react";

type ImageProps = React.ImgHTMLAttributes<HTMLImageElement> & {
  src: string;
  alt: string;
  width?: number;
  height?: number;
};

const Image: React.FC<ImageProps> = ({ src, alt, width, height, ...rest }) => {
  return <img src={src} alt={alt} width={width} height={height} {...rest} />;
};

export default Image;


