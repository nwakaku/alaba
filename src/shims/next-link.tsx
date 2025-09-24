import React from "react";
import { Link as RouterLink } from "react-router-dom";

type LinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
};

const Link: React.FC<LinkProps> = ({ href, children, ...rest }) => {
  return (
    <RouterLink to={href} {...(rest as any)}>
      {children}
    </RouterLink>
  );
};

export default Link;


