<script>
    import { emotions, settings } from "$lib/store";
    let { value = $bindable({}), class: className = "" } = $props();

    const defaults = $settings.includeDefaults ? [
        {
            id: "creeper_crush:none",
            uri: ""
        },
        {
            id: "creeper_crush:blush",
            uri: "/emotions/blush.png"
        },
        {
            id: "creeper_crush:happy",
            uri: "/emotions/happy.png"
        }
    ] : []

    function consolidated() {
        return $emotions.concat(defaults)
    }
</script>

<select class={ className }>
    {#each consolidated() as emotion}
        <option value="{ emotion.id }">{ emotion.id }</option>
    {/each}
</select>


