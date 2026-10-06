// KY never uses RU as an implicit substitute. Empty/null translations share one policy.
export function localizedText(record, field, locale, azField = field) {
  const keys = {az: azField, en: `${field}En`, ru: `${field}Ru`, ky: `${field}Ky`};
  const order = locale === "ky" ? ["ky", "az", "en"] : [locale, "az", "en"];
  for (const language of [...new Set(order)]) {
    const value = record?.[keys[language]];
    if (typeof value === "string" && value.trim()) return value;
  }
  return "";
}
