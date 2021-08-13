# Minecraft Textures
This is a library containing all the textures I use for my generators. **You're free to use it so long as you credit me** (see below).

There are textures from 1.12 to 1.17 currently available.

`npm install minecraft-textures`

## Example Usage:
```js
import hasVersion from 'minecraft-textures'
const version = '1.16'
if (hasVersion(version)) {
    const { default: textures } = await import(`minecraft-textures/dist/textures/${version}.js`)
}
```

You can also import the JSON files if you are using Node.js.

## Update Notes
- When upgrading to 1.17, the file names were updated to be the actual version (i.e. `1.17.ts` rather than `117.ts`)
- When upgrading to 1.16, the versions are now dynamically imported. You will need to import the path provided by `byVersion`.
    - For anyone using the .json files, you can now use something like this:
        - https://unpkg.com/minecraft-textures/dist/textures/json/1.16.json

## License
Please credit `destruc7i0n (https://thedestruc7i0n.ca)` if you use this.

The Minecraft item icons are owned by Mojang Studios.

This project is not affiliated with Mojang Studios.
