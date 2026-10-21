import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

// Police embarquée dans public/fonts (aucun accès réseau nécessaire au rendu)
export const fontFamily = "Montserrat";

for (const weight of ["800", "900"]) {
  loadFont({
    family: fontFamily,
    url: staticFile(`fonts/montserrat-latin-${weight}-normal.woff2`),
    weight,
  });
}
