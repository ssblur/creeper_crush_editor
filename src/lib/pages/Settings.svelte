<script>
    import { settings } from "$lib/store";
</script>

<div class="p-2">
    <input type="checkbox" id="includeDefaults" bind:checked={$settings.includeDefaults} />
    <label for="includeDefaults">Include Default Assets?</label>
    <br />
    <br />

    <label for="language">Default language:</label>
    <input type="text" id="language" bind:value={$settings.language} />
    <br />
    <br />

    <label for="language">Pack namespace:</label>
    <input type="text" id="language" bind:value={$settings.namespace} />
    <br />
    <br />
</div>