"use client";

import { Link, useParams } from "react-router-dom";
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
  const params = useParams<{ businessSlug?: string }>();
  const businessSlug = params.businessSlug;

  return businessSlug ?? defaultBusinessSlug;
}

export function BusinessAdminLink({
  href,
  ...props
}: Omit<ComponentProps<typeof Link>, "to"> & { href: string }) {
  const businessSlug = useBusinessSlug();
  const resolvedHref = resolveBusinessAdminHref(href, businessSlug);

  return <Link to={resolvedHref} {...props} />;
}
