<script>
    import { emotions, settings } from "$lib/store";
    import defaultEmotions from "$lib/defaultEmotions.json"
    let { value = $bindable({}), class: className = "" } = $props();

    const defaults = $settings.includeDefaults ? defaultEmotions : []

    function consolidated() {
        return $emotions.concat(defaults)
    }
</script>

<select class={ className } bind:value={ value }>
    {#each consolidated() as emotion}
        <option value="{ emotion.id }">{ emotion.id }</option>
    {/each}
</select>


