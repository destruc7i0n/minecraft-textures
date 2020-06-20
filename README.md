# Minecraft Textures
This is a library containing all the textures I use for my generators. You're free to use it so long as you credit me.

### There are 1.12 to 1.16 textures currently available.

The Minecraft item icons are owned by Mojang AB.
This is not endorsed by Mojang AB.

`npm install minecraft-textures`

#### Example Usage:
```js
import hasVersion from 'minecraft-textures'
const version = '1.16'
if (hasVersion(version)) {
    const { default: textures } = await import(`minecraft-textures/dist/textures/${version}.js`)
}
```

#### Notes
- When upgrading to 1.16, the versions are now dynamically imported. You will need to import the path provided by `byVersion`.
    - For anyone using the .json files, you can now use something like this:
        - https://unpkg.com/minecraft-textures/dist/textures/json/1.16.json

### Created by TheDestruc7i0n