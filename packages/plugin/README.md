## Figma Plugin Template

This is the plugin package. `src/main.tsx` is the entry point for the ui, `src/code.ts` is the entry point for the plugin' main (node) process. There are two vite builds, one to control each.

`/src/common/msg.ts` is the typed boundary between the main & ui process of the plugin.
