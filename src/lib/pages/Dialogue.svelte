<script>
    // TODO: add button rendering
    import showdown from "showdown";
    import EmotionPicker from "$lib/components/EmotionPicker.svelte";
    import ScenePicker from "$lib/components/ScenePicker.svelte";
    import StringList from "$lib/components/StringList.svelte";
    import {dialogue, emotions, markdown, settings, sprites} from "$lib/store";
    import defaultEmotions from "$lib/defaultEmotions.json";
  import SpritePicker from "$lib/components/SpritePicker.svelte";
    let current = $state(0)

    function add() {
        const i = $dialogue.length
        $dialogue = $dialogue.concat([{
            id: `scene_${i}`,
            entity: "minecraft:creeper",
            condition: {
                never: true
            },
            dialogue: `dialogue_${i}`,
            options: {},
            emotion: null,
            change_condition: {},
            ends_dialogue: false,
            linked_markdown: $markdown.length,
            commands: [],
            sprites: [],
            requires: "",
        }])
        $markdown = $markdown.concat([{
            id: `dialogue_${i}`,
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

    function addSprite() {
        const sprite = $sprites[0] || null
        $dialogue[current].sprites = $dialogue[current].sprites.concat([{
            location: sprite,
            x: 0,
            y: 0,
            w: 64,
            h: 64,
        }])
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

    const converter = new showdown.Converter()
    function markdownComponent() {
        const text = $markdown[$dialogue[current].linked_markdown].text
        return converter.makeHtml(text)
    }

    function spriteURI(sprite) {
        for(let s of $sprites) {
            if(sprite.location == s.id) {
                return s.uri
            }
        }
        return "/missing.png"
    }

    let emotionURI = $derived((() => {
        const defaults = $settings.includeDefaults ? defaultEmotions : []
        const list = defaults.concat($emotions)
        const e = list.find(it => 
            it.id == $dialogue[current].emotion
        )
        if(e) return e.uri
        else return null
    })())
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
            <div class="cctemplate ml-8 mt-4">
                <div class="dialogue">
                    {@html markdownComponent() }
                </div>
                {#if emotionURI}
                    <img src={ emotionURI } alt="A creeper crush emotion with ID { $dialogue[current].emotion }" class="emotion" />
                {/if}
                {#each $dialogue[current].sprites as sprite}
                    <img 
                        src={ spriteURI(sprite) } 
                        alt="Sprite with ID { sprite.location }" 
                        class="sprite" 
                        style="width:{sprite.w * 2}px;height:{sprite.h * 2}px;right:{sprite.x * 2}px;bottom:{sprite.y * 2 + 13}px;"
                        />
                {/each}
            </div>
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

            Sprites:
            <button class="text-small px-1 rounded bg-blue-500 text-white" onclick={ addSprite }>+</button>
            <br/>
            <small>
                Sprites rendered in the scene.
                Statically scaled and positioned from the bottom right.
                <br/>
                Sprites are positioned behind the textbox, but will render over it in the preview here. Sorry :/
            </small>
            <br/>
            {#each $dialogue[current].sprites as v, k}
                <div class="pl-2 border-l-2">
                    Sprite:
                    <br/>
                    <SpritePicker bind:value={$dialogue[current].sprites[k].location} class="w-5/6" />
                    <br/>
                    <span class="w-16 inline-block">X:</span>
                    <input type="number" bind:value={$dialogue[current].sprites[k].x} class="w-1/3" />
                    <br/>
                    <span class="w-16 inline-block">Y:</span>
                    <input type="number" bind:value={$dialogue[current].sprites[k].y} class="w-1/3" />
                    <br/>
                    <span class="w-16 inline-block">Width:</span>
                    <input type="number" bind:value={$dialogue[current].sprites[k].w} class="w-1/3" />
                    <br/>
                    <span class="w-16 inline-block">Height:</span>
                    <input type="number" bind:value={$dialogue[current].sprites[k].h} class="w-1/3" />
                </div>
                <br/>
            {/each}
            <br/>
            <br/>

            Requires
            <br/>
            <small>
                If set to a mod id, this dialogue will only be available if that mod is loaded.
            </small>
            <br/>
            <input type="text" class="w-5/6" bind:value={ $dialogue[current].requires }>
            <br/>
            <br/>

            Commands
            <br/>
            <small>
                These commands will be run <em>every time</em> this dialogue is opened.
                <br/>
                @s targets the player who opened the dialogue.
                <br/>
                @date targets the targeted entity.
                <br/>
                $date_uuid is the UUID of the targeted entity.
                <br/>
                $date_name is the custom name or entity name of the targeted entity.
            </small>
            <br/>
            <StringList bind:value={ $dialogue[current].commands } />
            <br/>
            <br/>
        </div>
    {/if}
</div>