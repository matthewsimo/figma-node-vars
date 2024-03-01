## Node Vars Figma Plugin

> See what variables your selected nodes are using

This plugin tracks what nodes you have selected (and their children) and shows you all of the bound variables that are referenced in a table. You can then copy each individually or all bound variables for a node in a CSS format.

---

This is the plugin package. `src/main.tsx` is the entry point for the ui, `src/code.ts` is the entry point for the plugin' main (node) process. There are two vite builds, one to control each.

`/src/common/msg.ts` is the typed boundary between the main & ui process of the plugin.
