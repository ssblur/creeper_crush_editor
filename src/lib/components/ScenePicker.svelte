<script>
    import { dialogue } from "$lib/store";
    let { value = $bindable({}), class: className = "" } = $props();
</script>

<select class={ className } bind:value={value}>
    {#each $dialogue as scene}
        <option value="{ scene.id }">{ scene.id }</option>
    {/each}
</select>


