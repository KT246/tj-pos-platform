"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import type { ComponentProps } from "react";

export const defaultBusinessSlug = "tj-cafe-vientiane";

export function resolveBusinessAdminHref(
  href: string,
  businessSlug = defaultBusinessSlug
) {
  const scopedHref = href.replaceAll("[businessSlug]", businessSlug);

  if (scopedHref === "/business-admin") {
    return `/business-admin/${businessSlug}`;
  }

  if (scopedHref.startsWith("/business-admin/")) {
    return `/business-admin/${businessSlug}${scopedHref.slice("/business-admin".length)}`;
  }

  return scopedHref;
}

function useBusinessSlug() {
  const params = useParams<{ businessSlug?: string | string[] }>();
  const businessSlug = params.businessSlug;

  if (Array.isArray(businessSlug)) {
    return businessSlug[0] ?? defaultBusinessSlug;
  }

  return businessSlug ?? defaultBusinessSlug;
}

export function BusinessAdminLink({
  href,
  ...props
}: ComponentProps<typeof Link>) {
  const businessSlug = useBusinessSlug();
  const resolvedHref =
    typeof href === "string" ? resolveBusinessAdminHref(href, businessSlug) : href;

  return <Link href={resolvedHref} {...props} />;
}
