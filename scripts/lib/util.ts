export const compareMinecraftVersions = (
  version1: string,
  version2: string
) => {
  const v1 = version1.split('.').map((el) => Number(el));
  const v2 = version2.split('.').map((el) => Number(el));

  for (let i = 0; i < v1.length; i++) {
    if (v1[i] > v2[i]) return 1;
    if (v1[i] < v2[i]) return -1;
  }

  return 0;
};
