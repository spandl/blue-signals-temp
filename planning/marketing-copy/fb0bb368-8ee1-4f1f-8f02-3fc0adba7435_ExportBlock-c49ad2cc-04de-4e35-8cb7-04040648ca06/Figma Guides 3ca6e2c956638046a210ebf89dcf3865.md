# Figma Guides

Do

- Change color, type, radius, and spacing only as variables in the Obra collections. Do not paint hex on a detached instance.
- Keep using Nova kit components (the `… - Nova` instances). Do not rebuild the same control by hand.
- Ship every state as a variant (collapsed / hover / expanded), the way the header menus already are. One frame, one state.
- Use Lucide from the kit for icons. Custom marks (tree leaves, logo) stay as their own layers so they can be exported.
- After token or component edits in the kit library, publish it so the product file actually updates.

Avoid

- Padding on the artboard that is not product UI (the 25px on White label layout). Put the header at `y=0` of the frame, or use a separate “canvas” wrapper that is clearly not the app.
- Hard-coded type that fights the token (placeholder set to Inter while the kit is Geist).
- Flattened / outlined icons that used to be Lucide. Once they are raw vectors, we cannot tell they are Lucide.
- Detached components with local overrides instead of a variant. That is where MCP emits broken or guessed CSS.
- Reference screenshots and leftover images on the same page as the source frames. Only designed frames are implementable.
- Screens or copy that are not meant to ship. If it is on the product page as a frame, we will build it.