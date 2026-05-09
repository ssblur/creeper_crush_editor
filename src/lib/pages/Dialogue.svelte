<script>
  import EmotionPicker from "$lib/components/EmotionPicker.svelte";
  import ScenePicker from "$lib/components/ScenePicker.svelte";
    import {dialogue, markdown, settings} from "$lib/store"
    let current = $state(0)

    function add() {
        const i = $dialogue.length
        $dialogue = $dialogue.concat([{
            id: `${$settings.namespace}:scene_${i}`,
            entity: "minecraft:creeper",
            condition: {
                never: true
            },
            dialogue: `${$settings.namespace}:dialogue_${i}`,
            options: {},
            emotion: null,
            change_condition: {},
            ends_dialogue: false,
            linked_markdown: $markdown.length
        }])
        $markdown = $markdown.concat([{
            id: `${$settings.namespace}:dialogue_${i}`,
            text: "**Test dialogue please ignore**"
        }])
    }
    
    function addOption() {
        const i = Object.entries($dialogue[current].options).length
        $dialogue[current].options[`Option ${i}`] = $dialogue[0].id
    }

    function addCondition() {
        const i = Object.entries($dialogue[current].condition).length
        $dialogue[current].condition[`condition_${i}`] = true
    }

    function addChangeCondition() {
        const options = Object.entries($dialogue[current].condition).find(e => 
            $dialogue[current].change_condition[e[0]] === undefined && e[0] != "never"
        )
        let i
        if(options != undefined && options.length > 0) i = options[0]
        else i = `condition_${Object.entries($dialogue[current].change_condition).length}`
        $dialogue[current].change_condition[i] = true
    }
</script>

<div class="flex">
    <div class="p-2 w-1/4 relative">
        Scenes:
        <button class="right-2 absolute font-bold py-2 px-4 bg-blue-500 rounded text-white" onclick={ add }>Add</button>
        <br />
        <br />
        {#if $dialogue.length == 0}
            No scenes created.
        {:else}
            {#each $dialogue as scene, i}
                <a onclick={ () => current = i } href="#list">
                    <div class="{ current == i  ? 'bg-yellow-100' : 'odd:bg-gray-50' }">
                        { scene.id }
                    </div>
                </a>
            {/each}
        {/if}
    </div>
    {#if $dialogue[current]}
        <div class="grow bg-yellow-50">
            ID:
            <br/>
            <input type="text" class="w-5/6" bind:value={ $dialogue[current].id }>
            <br/>
            Entity Type: 
            <br/>
            <input type="text"  class="w-5/6" bind:value={ $dialogue[current].entity }>
            <br/>
            Dialogue:
            <small>(Supports Markdown)</small>
            <br/>
            <textarea rows=3 bind:value={ $markdown[$dialogue[current].linked_markdown].text } class="w-5/6"></textarea>
            <br/>
            Emotion: 
            <br/>
            <EmotionPicker class="w-5/6" bind:value={ $dialogue[current].emotion } />
            <br/>
            <br/>
            {#if !$dialogue[current].ends_dialogue && (Object.entries($dialogue[current].options).length == 0)}
                <div class="bg-red-200 border-2 p-2 w-1/2">
                    <small>Dialogue should either have selectable options or a close option!</small>
                </div>
            {/if}
            Show Close Dialogue Option: <input type="checkbox" bind:checked={ $dialogue[current].ends_dialogue }>
            <br/>

            <br/>

            Required Condition:
            <button class="text-small px-1 rounded bg-blue-500 text-white" onclick={ addCondition }>+</button>
            <br/>
            <small>
                This dialogue will only be picked to start a conversation if all the conditions specified here are as expected.
                <br/>
                An unset condition is equivalent to a false/unchecked one.
                <br/>
                The convention for dialogue that is not available to start a conversation is "never" set to true/checked.
            </small>
            <br/>
            {#each Object.entries($dialogue[current].condition || {}) as [k, v]}
                <input onchange={ e => {
                    delete $dialogue[current].condition[k]
                    $dialogue[current].condition[e.target.value] = v
                }} value={k} type="text" />
                <input type="checkbox" bind:checked={$dialogue[current].condition[k]}>
                <br/>
            {/each}
            <br/>
            <br/>

            Update Condition:
            <button class="text-small px-1 rounded bg-blue-500 text-white" onclick={ addChangeCondition }>+</button>
            <br/>
            <small>
                The condition with this mob will be updated to match conditions laid out here.
                This affects which dialogue can be chosen to start a conversation.
            </small>
            <br/>
            {#each Object.entries($dialogue[current].change_condition || {}) as [k, v]}
                <input onchange={ e => {
                    delete $dialogue[current].change_condition[k]
                    $dialogue[current].change_condition[e.target.value] = v
                }} value={k} type="text" />
                <input type="checkbox" bind:checked={$dialogue[current].change_condition[k]}>
                <br/>
            {/each}
            <br/>
            <br/>

            Dialogue Options:
            <button class="text-small px-1 rounded bg-blue-500 text-white" onclick={ addOption }>+</button>
            <br/>
            <small>
                Options available during this scene.
                Each one will direct the user to the specified scene.
            </small>
            <br/>
            {#each Object.entries($dialogue[current].options || {}) as [k, v]}
                <div class="pl-2 border-l-2">
                    Option Text:
                    <br/>
                    <input onchange={ e => {
                        delete $dialogue[current].options[k]
                        $dialogue[current].options[e.target.value] = v
                    }} value={k} type="text" class="w-5/6" />
                    <br/>
                    <br/>
                    Scene:
                    <br/>
                    <ScenePicker bind:value={$dialogue[current].options[k]} class="w-5/6"></ScenePicker>
                </div>
                <br/>
            {/each}
            <br/>
            <br/>
        </div>
    {/if}
</div>