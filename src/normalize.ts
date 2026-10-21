export const normalizeWord = (w: string) =>
  w
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9']/g, "");

/** Compare un mot TTS avec un déclencheur ("l'eau" doit matcher "eau" et inversement). */
export const wordMatches = (spoken: string, trigger: string) => {
  const a = normalizeWord(spoken);
  const b = normalizeWord(trigger);
  if (a === b) return true;
  const strip = (s: string) => s.replace(/^[a-z]+'/, "");
  return strip(a) === strip(b);
};
