import { writable } from "svelte/store";

export const settings = writable({
    includeDefaults: true,
    language: "en_us",
    namespace: "creeper_crush_addon",
})
export const dialogue = writable([])
export const markdown = writable([])
export const sprites = writable([])
export const emotions = writable([])