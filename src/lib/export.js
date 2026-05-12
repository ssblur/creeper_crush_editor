import JSZip from "jszip";
import FileSaver from "file-saver";
import { settings, dialogue, markdown, sprites, emotions } from "$lib/store";
import { get } from 'svelte/store';
const placeholderPng = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IB2cksfwAAAARnQU1BAACxjwv8YQUAAAAgY0hSTQAAeiYAAICEAAD6AAAAgOgAAHUwAADqYAAAOpgAABdwnLpRPAAAAAlwSFlzAAAuIwAALiMBeKU/dgAAAAd0SU1FB+oFCxQDKRZaWjYAAAH9SURBVFjD7ZS7rylhFMWX6xXRKhREo9b7A9QqwsTIJB4RQaPwBxAlvUQUChGFSkFBR6GbgsmIioLEhMIjEbJvcZPJHM7NiNxzz03urO7b3yO/rL2/pSMiwjfqB75ZGsC/DcCyLHQ63ZcC6NR+gdPpxGq1+jsOxONxxGIxTKfT314YjUaIx+PodDoQBAGxWAwsy+JwOAAAeJ5HOp1GoVDAfr9XBTAoF/1+H7PZDOl0Gs1m89MLp9MJAFCpVOB2u1GtVmGz2eT9UqkEq9UKSZIgCAK8Xu/rAABgMplwuVzktcvlwu12g8Hw62itVkO32wXHcXJNKbPZjHK5DLvdjpcyjhRyOBzEsiwNBgO51m63iWEYWi6XRETUarUoEAgQwzA0n8+JYRiKRCK0Xq+JiIjneUokEhQKhWiz2ZCaPgzhVw/cW7/g/wqier2Od4Kp0Wi8T/A4hGr67IzH46F39dSCaDSKXq8HAFgsFsjlcsjlclgsFk/ww+EQ4XAYx+NRrj0GUT6fB8uyKBaLrzlwvV7J5/MREVEymSRJkmi321EqlXpywO/30/l8/uBAIBAgjuMoGAzSeDxWdfUpSYxGI7bbrRIQer1e7r0ymCwWC+73+58NImVPRVGkbDZLmUyGRFF8CqbJZEIcxxHHcfIbj0Gk5oCWAxqABqABaAAawE+NgTw4jJdhzwAAAABJRU5ErkJggg==";

function addJSON(zip, filename, json) {
    zip.file(filename, JSON.stringify(json));
}

function defaultNS(id, namespace) {
    if(!id || id.includes(":")) return id;
    return `${namespace}:${id}`;
}

function clone(json) {
    return JSON.parse(JSON.stringify(json));
}

function png(uri) {
    const u = !uri || uri.length === 0 ? placeholderPng : uri
    // we assume it's base64, should be if it was made in-app
    return Uint8Array.fromBase64(u.split(',', 2)[1])
}

export default async function() {
    let $settings = get(settings);
    let $dialogue = get(dialogue);
    let $markdown = get(markdown);
    let $sprites = get(sprites);
    let $emotions = get(emotions);

    const namespace = $settings.namespace
    const lang = $settings.language

    const dataZip = new JSZip();
    const dataDir = `data/${namespace}`;

    // datapack meta
    dataZip.file("pack.mcmeta", JSON.stringify({
        pack: {
            description: "Creeper Crush Custom Datapack",
            min_format: 101,
            max_format: 101
        }
    }))

    // dialogue
    for(let entry of $dialogue) {
        let s = entry.id.split(":");
        let dir = s.length <= 1 ? dataDir : `data/${s[0]}`;
        let loc = s.length <= 1 ? entry.id : s[1];

        let options = {}
        for(let key of Object.keys(entry.options)) {
            options[key] = defaultNS(entry.options[key], namespace);
        }

        let sprites = []
        if(entry.sprites) {
            for(let sprite in entry.sprites) {
                sprites.push(defaultNS(sprite, namespace))
            }
        }

        addJSON(dataZip, `${dir}/creeper_crush/dialogue/${loc}.json`, {
            entity: entry.entity,
            condition: entry.condition,
            dialogue: defaultNS(entry.dialogue, namespace),
            options,
            emotion: defaultNS(entry.emotion, namespace),
            change_condition: entry.change_condition,
            ends_dialogue: entry.ends_dialogue,
            commands: entry.commands,
            requires: entry.requires,
            sprites: entry.sprites,
        });
    }

    dataZip.generateAsync({type: "blob"}).then(file => {
        FileSaver.saveAs(file, `${namespace}-data.zip`);
    })

    const resourceZip = new JSZip();
    const resourceDir = `assets/${namespace}`;

    // resource pack meta
    resourceZip.file("pack.mcmeta", JSON.stringify({
        pack: {
            description: "Creeper Crush Custom Resource Pack",
            min_format: 84,
            max_format: 84
        },
    }));

    // dialogue markdown files
    for(let entry of $markdown) {
        let s = entry.id.split(":");
        let dir = s.length <= 1 ? resourceDir : `data/${s[0]}`;
        let loc = s.length <= 1 ? entry.id : s[1];
        resourceZip.file(`${dir}/unfocused/markdown/${lang}/${loc}.md`, entry.text);
    }

    // sprites (with placeholder files)
    for(let entry of $sprites) {
        let s = entry.id.split(":");
        let dir = s.length <= 1 ? resourceDir : `data/${s[0]}`;
        let loc = s.length <= 1 ? entry.id : s[1];
        resourceZip.file(`${dir}/textures/gui/sprites/${loc}.png`, png(entry.uri));
    }

    // emotions (with placeholder files)
    for(let entry of $emotions) {
        let s = entry.id.split(":");
        let dir = s.length <= 1 ? resourceDir : `data/${s[0]}`;
        let loc = s.length <= 1 ? entry.id : s[1];
        resourceZip.file(`${dir}/textures/gui/sprites/emotion/${loc}.png`, png(entry.uri));
    }

    resourceZip.generateAsync({type: "blob"}).then(file => {
        FileSaver.saveAs(file, `${namespace}-resource.zip`);
    })
}