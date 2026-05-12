<script>
    import { sprites } from "$lib/store";
    let { value = $bindable({}), class: className = "" } = $props();
</script>

<select class={ className } bind:value={value}>
    {#each $sprites as v}
        <option value="{ v.id }">{ v.id }</option>
    {/each}
</select>


