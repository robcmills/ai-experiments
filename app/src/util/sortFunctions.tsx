export function descending(keyFn: Function = (i: any) => i) {
  return (a: any, b: any) => keyFn(b) - keyFn(a);
}

export function ascending(keyFn: Function = (i: any) => i) {
  return (a: any, b: any) => keyFn(a) - keyFn(b);
}
