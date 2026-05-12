<script>
    let { value = $bindable([]) } = $props();

    function remove(index) {
        value = value.filter((_, i) => i != index)
    }

    function add() {
        value = value.concat([""])
    }
</script>

<div class="p-2">
    <div class="mx-2 w-5/6">
        {#if value.length == 0}
            <div class="w-full py-2 px-4 relative flex items-center">
                No entries added.
            </div>
        {/if}
        {#each value as item, index}
            <div class="w-full py-2 px-4 relative flex items-center">
                <input type="text" class="grow mr-2" bind:value={value[index]}>
                <button class="border-2 p-2 px-8 rounded bg-red-500 text-white" onclick={() => remove(index)}>Remove</button>
            </div>
        {/each}
    </div>
    <button class="border-2 p-2 px-8 rounded bg-blue-500 text-white m-2" onclick={add}>Add</button>
</div>