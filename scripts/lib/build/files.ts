export async function writeJson(path: string, value: unknown) {
  await writeFile(path, `${JSON.stringify(value, null, 2)}\n`);
}

export async function writeFile(path: string, contents: string) {
  await Bun.write(path, contents);
}
