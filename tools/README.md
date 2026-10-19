# Post image renderer

```
cd tools && npm install          # once per session (playwright 1.56.1; Chromium is preinstalled)
node render.js batch.json ../2026-10/       # array of specs -> one JPG per spec (name = file name)
node render.js one.json out.jpg             # single spec
```

Output: 1638×2048 (portrait) or 2048×2048 (square) JPG — Facebook's 2048px maximum. The script prints the final
base font size per image; if it prints `WARNING: text too long`, shorten the text.

## Spec

Common fields: `name` (file name, no extension), `template`, `theme`, `size`
(`portrait` default, or `square`), optional `align: "top"`, optional `deco: false`.

Text markup: `*words*` = highlight colour, `\n` = line break. A line may break right after a highlight, so keep a following particle inside it (`*Message ၅ စောင်က*`, not `*Message ၅ စောင်*က`). Lines only break at
spaces, so put a space between Burmese phrases (as normal writing does). Avoid emoji
inside images except ✅ ❌ 👇.

Themes: `navy` (dark), `orange`, `cream` (light warm), `white` (light cool).

| template | fields |
|---|---|
| `statement` | `text`, `kicker?`, `sub?` — one big sentence |
| `tip` | `title`, `body?`, `number?`, `kicker?`, `example?`, `exampleLabel?` |
| `beforeafter` | `before`, `after`, `title?`, `note?`, `beforeLabel?`, `afterLabel?` |
| `checklist` | `title`, `items[]` (3–6), `kicker?`, `footer?` |
| `mythfact` | `myth`, `fact`, `title?`, `mythLabel?`, `factLabel?` |
| `quote` | `quote`, `attribution?` |
| `versus` | `question`, `a`, `b`, `kicker?`, `footer?` (square = side by side) |
| `chat` | `messages[]` of `{from:"customer"|"shop", text}`, `title?`, `footer?`, `shopLabel?`, `customerLabel?` |
| `steps` | `title`, `steps[]` of `{h, t?}` (2–5), `kicker?` |
| `note` | `body`, `title?` — paper-note look |
