# Visual UI Mockup Workflow

Use this when describing UI changes in words starts getting lossy.

## The Loop

1. Run the app locally.

```powershell
npm.cmd run dev
```

2. Open the route you want to refine, for example:

```text
http://127.0.0.1:5173/rider
http://127.0.0.1:5173/admin
http://127.0.0.1:5173/driver
http://127.0.0.1:5173/superadmin
```

3. Take a screenshot of the screen.

4. Visually edit that screenshot in whichever tool feels easiest:

- Figma
- Canva
- Excalidraw
- PowerPoint
- Paint
- Snipping Tool markup

5. Export or save the marked-up image into:

```text
mockups/inbox/
```

Use a name like:

```text
2026-05-16-rider-home-pass-balance.png
```

6. Fill in the small handoff file:

```text
mockups/REQUEST.md
```

7. Ask Codex:

```text
Apply the latest mockup request.
```

Codex will read the request, inspect the referenced route/components, translate the visual change into code, run verification, and report what changed.

## What To Put In The Mockup

Mark visual changes directly on the image whenever possible:

- Move this here.
- Make this smaller.
- Use this spacing.
- Hide this.
- Make this feel more premium / denser / calmer.
- Change this text.
- Replace this section with the sketched layout.

Use `mockups/REQUEST.md` only for things the image cannot express clearly, such as state rules, interaction behavior, or exact content.

## File Roles

- `mockups/inbox/`: active screenshots, exports, or visual notes that Codex should read.
- `mockups/REQUEST.md`: the current design handoff.
- `mockups/archive/`: old references after a change has been implemented.
- `docs/UI_MOCKUP_WORKFLOW.md`: this workflow.

## Codex Translation Rules

When applying a mockup, Codex should:

- Treat the image as the source of truth for layout, hierarchy, spacing, and visual tone.
- Preserve existing app behavior unless the request says otherwise.
- Prefer existing components, CSS tokens, and route structure.
- Keep edits scoped to the target screen and shared styles that screen already uses.
- Run `npm.cmd run build` before handoff.

