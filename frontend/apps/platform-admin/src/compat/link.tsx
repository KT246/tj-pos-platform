import { Link as RouterLink } from "react-router-dom";
import type { ComponentProps } from "react";

type LinkProps = Omit<ComponentProps<typeof RouterLink>, "to"> & {
  href: ComponentProps<typeof RouterLink>["to"];
};

export default function Link({ href, ...props }: LinkProps) {
  return <RouterLink to={href} {...props} />;
}
