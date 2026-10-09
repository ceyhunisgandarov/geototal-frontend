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

const projectNamesKy = {
  "hadrut-restoration": "Карабах аймагы, Ходжавенд району, Хадрут шаарчасын калыбына келтирүү",
  "tugh-restoration": "Карабах аймагы, Ходжавенд районунун Туг айылын (Атагут жана Хунерли айылдары менен бирге) калыбына келтирүү",
  "aghbendrailway": "Хорадиз-Агбенд темир жол долбоору",
  "ahmedbeyli-aghbend": "Ахмедбейли-Хорадиз-Миндживан-Агбенд автомобиль жолу",
  "azersu": "AZERSU административдик имараты"
};

export function localizedProjectName(project, locale) {
  if (locale === "ky") return project?.projectNameKy || projectNamesKy[project?.path] || project?.projectName || "";
  return project?.projectName || "";
}
