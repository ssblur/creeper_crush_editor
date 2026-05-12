<script>
    import { sprites, settings } from "$lib/store";
    let current = $state(0)

    function add() {
        $sprites = $sprites.concat([{
            id: "sprite_" + $sprites.length,
            uri: ""
        }])
    }

    function updateURI(event) {
        const file = event.target.files[0]
        const reader = new FileReader()

        reader.onload = () => {
            $sprites[current].uri = reader.result
        }

        reader.readAsDataURL(file)
    }
</script>

<div class="p-2 bg-red-200">
    <h2>Warning!</h2>
    <small>
        This editor stores sprites in memory while open! 
        If your browser struggles to manage that, you can add sprites without uploading them to include them in drop-downs,
        and add them to the pack manually later.
    </small>
</div>

<div class="flex" id="list">
    <div class="p-2 w-1/5 relative">
        Custom sprites:
        <button class="right-2 absolute font-bold py-2 px-4 bg-blue-500 rounded text-white" onclick={add}>Add</button>
        <br />
        <br />
        {#if $sprites.length == 0}
            No sprites added.
        {:else}
            {#each $sprites as sprite, i}
                <a onclick={ () => current = i } href="#list">
                    <div class="{ current == i  ? 'bg-yellow-100' : 'odd:bg-gray-50' }">
                        { sprite.id }
                    </div>
                </a>
            {/each}
        {/if}
    </div>
    {#if $sprites[current]}
        <div class="grow bg-yellow-50">
            ID: <input type="text" class="w-1/2" bind:value={ $sprites[current].id }>
            <br/>
            <br/>

            Upload: 
            <input type="file" onchange={ updateURI } accept=".png" class="border-2" />
            <br/>
            <br/>

            <img 
                src={$sprites[current].uri} 
                style="width: 128px; height: 128px; overflow: hidden;" 
                class="bg-yellow-200" 
                alt="emotion sprite for {$sprites[current].id}"/>
        </div>
    {/if}
</div>