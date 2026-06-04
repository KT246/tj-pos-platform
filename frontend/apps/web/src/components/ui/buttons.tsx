"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { useI18n } from "../../lib/i18n";

function translateNode(node: ReactNode, t: (text: string) => string) {
  return typeof node === "string" ? t(node) : node;
}

export function PrimaryButton({
  href,
  children
}: {
  href: string;
  children: ReactNode;
}) {
  const { t } = useI18n();

  return (
    <Link
      href={href}
      className="font800 inline-flex h-10 items-center justify-center gap-2 rounded-md bg-blue-600 px-5 text-sm text-white shadow-sm shadow-blue-200 transition hover:bg-blue-700"
    >
      {translateNode(children, t)}
      <ArrowRight className="h-4 w-4" />
    </Link>
  );
}

export function SecondaryButton({
  href,
  children,
  icon
}: {
  href: string;
  children: ReactNode;
  icon?: ReactNode;
}) {
  const { t } = useI18n();

  return (
    <Link
      href={href}
      className="font800 inline-flex h-10 items-center justify-center gap-2 rounded-md border border-blue-300 bg-white px-5 text-sm text-blue-600 transition hover:bg-blue-50"
    >
      {translateNode(children, t)}
      {icon}
    </Link>
  );
}
