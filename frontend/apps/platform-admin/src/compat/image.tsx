import type { ImgHTMLAttributes } from "react";

type ImageProps = Omit<ImgHTMLAttributes<HTMLImageElement>, "src"> & {
  src: string;
  priority?: boolean;
};

export default function Image({ priority: _priority, ...props }: ImageProps) {
  return <img {...props} />;
}
