export function getCategoryKey(categoryName: string) {
  const normalized = categoryName.trim()

  if (!normalized) return "other"

  const aliasValue = normalized
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()

  if (aliasValue.includes("ca phe") || aliasValue.includes("coffee")) return "coffee"
  if (aliasValue.includes("tra") || aliasValue.includes("tea")) return "tea"
  if (
    aliasValue.includes("da xay") ||
    aliasValue.includes("frappe") ||
    aliasValue.includes("ice blended")
  ) {
    return "frappe"
  }
  if (aliasValue.includes("nuoc ep") || aliasValue.includes("juice")) return "juice"
  if (aliasValue.includes("banh") || aliasValue.includes("cake")) return "cake"

  return (
    aliasValue
      .replace(/[^\p{L}\p{N}]+/gu, "-")
      .replace(/^-+|-+$/g, "") || "other"
  )
}
