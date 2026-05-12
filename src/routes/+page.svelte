<script>
    import Dialogue from "$lib/pages/Dialogue.svelte"
    import Settings from "$lib/pages/Settings.svelte"
    import Emotions from "$lib/pages/Emotions.svelte"
    import Sprites from "$lib/pages/Sprites.svelte"
    import exportPacks from "$lib/export"

    let tab = $state("settings")

    import { settings, dialogue, markdown, sprites, emotions } from "$lib/store";
</script>

<style>
    .tab {
        border-radius: 10% 10% 0 0;
        border: 1px solid #0004;
        border-bottom: none;
        cursor: pointer;
    }
</style>

<div class="content p-4 pb-0">
    <h1>Creeper Crush Editor&nbsp;&nbsp;&nbsp;<small>Beta!</small></h1>

    <br />

    <button type="button" onclick={() => tab = "settings"} class="font-bold py-2 px-4 tab {tab == "settings" ? "bg-blue-300" : "bg-blue-100"}">Settings</button>
    <button type="button" onclick={() => tab = "dialogue"} class="font-bold py-2 px-4 tab {tab == "dialogue" ? "bg-blue-300" : "bg-blue-100"}">Dialogue</button>
    <button type="button" onclick={() => tab = "emotions"} class="font-bold py-2 px-4 tab {tab == "emotions" ? "bg-blue-300" : "bg-blue-100"}">Emotions</button>
    <button type="button" onclick={() => tab = "sprites"} class="font-bold py-2 px-4 tab {tab == "sprites" ? "bg-blue-300" : "bg-blue-100"}">Sprites</button>
    <button type="button" onclick={exportPacks} class="font-bold py-2 px-4 tab bg-blue-500 text-white">Export</button>
</div>

<hr />

<div class="content">
    {#if tab == "settings"}
        <Settings></Settings>
    {:else if tab == "dialogue"}
        <Dialogue></Dialogue>
    {:else if tab == "emotions"}
        <Emotions></Emotions>
    {:else if tab == "sprites"}
        <Sprites></Sprites>
    {/if}
</div>