# Vidéos explicatives TikTok (Remotion + Three.js)

Vidéos verticales 1080×1920 à 30 fps, rendues entièrement dans GitHub Actions.

## Lancer un rendu (depuis le téléphone)

1. Onglet **Actions** du dépôt → workflow **« Rendre une vidéo »**.
2. **Run workflow** → saisir le nom du dossier (ex. `test-eau`) → **Run workflow**.
3. Une fois le run terminé (coche verte), ouvrir le run → section **Artifacts** en bas → télécharger
   l'artifact (un `.zip` qui contient le `.mp4` et le `timing.json`).

## Ajouter une vidéo

Créer `videos/<nom>/` (lettres, chiffres, tirets) avec :

- `script.txt` : le texte de la voix off (voix `fr-FR-HenriNeural`).
- `scene.tsx` : exporte `scene: SceneDef` (voir `src/types.ts`) :
  - `World` : le contenu 3D (React Three Fiber), reçoit `t` en secondes ;
  - `camera(t)` : la pose de caméra à l'instant `t` (position, cible, fov) ;
  - `annotations` : étiquettes `{ word, label, target: [x, y, z] }` qui apparaissent quand la voix
    prononce `word` (insensible à la casse/accents ; `occurrence` si le mot revient plusieurs fois).

La composition Remotion est créée automatiquement, et sa durée suit celle de la voix off.

## Comment ça marche

- `scripts/tts.py` : edge-tts avec `boundary="WordBoundary"` → `public/voice/<nom>/voice.mp3` +
  `timing.json` (début/fin de chaque mot).
- `src/Subtitles.tsx` : sous-titres karaoké mot par mot (mot actif en jaune).
- `src/Annotations.tsx` : projette le point 3D avec la même caméra que la scène et trace le trait.
- `.github/workflows/render.yml` : voix → `remotion render --gl=swangle` → artifact MP4.
