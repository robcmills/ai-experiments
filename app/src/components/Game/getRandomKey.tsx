export function getRandomKey(obj: any) {
  const keys = Object.keys(obj);
  const key = (keys.length * Math.random()) << 0;
  return keys[key];
}
