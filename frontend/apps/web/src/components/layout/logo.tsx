import Link from "next/link";
import Image from "next/image";

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2" aria-label="TJ POS Home">
      <Image
        src="/logo.png"
        alt="TJ POS - Smart POS for Every Business"
        width={2508}
        height={627}
        className="h-9 w-auto object-contain"
      />
    </Link>
  );
}
