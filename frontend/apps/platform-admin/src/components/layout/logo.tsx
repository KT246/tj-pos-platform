import Image from "../../compat/image";
import Link from "../../compat/link";

type LogoProps = {
  href?: string;
  className?: string;
  markClassName?: string;
  textClassName?: string;
  taglineClassName?: string;
  showTagline?: boolean;
  priority?: boolean;
};

function joinClasses(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function Logo({
  href = "/",
  className,
  markClassName = "h-9 w-9",
  textClassName = "text-2xl",
  taglineClassName = "text-[7px]",
  showTagline = true,
  priority = false
}: LogoProps) {
  const content = (
    <>
      <Image
        src="/brand/tj-pos-mark.png"
        alt="TJ POS logo mark"
        width={497}
        height={486}
        className={joinClasses("shrink-0 object-contain", markClassName)}
        priority={priority}
      />
      <span className="min-w-0 leading-none">
        <span
          className={joinClasses(
            "font900 block leading-none whitespace-nowrap",
            textClassName
          )}
        >
          <span className="text-[#1494f7]">TJ</span>
          <span className="ml-1 text-[#061f55]">POS</span>
        </span>
        {showTagline ? (
          <span
            className={joinClasses(
              "font800 mt-1 block leading-none whitespace-nowrap text-slate-500",
              taglineClassName
            )}
          >
            Smart POS For Every Business
          </span>
        ) : null}
      </span>
    </>
  );

  const logoClassName = joinClasses("flex items-center gap-2", className);

  if (!href) {
    return <div className={logoClassName}>{content}</div>;
  }

  return (
    <Link href={href} className={logoClassName} aria-label="TJ POS Home">
      {content}
    </Link>
  );
}
