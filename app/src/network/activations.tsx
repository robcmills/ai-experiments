const clamp = (x: number) => {
  const max = Number.MAX_VALUE;
  if (x === Infinity) return max;
  if (x === -Infinity) return -max;
  return x;
};

export const relu = (x: number) => clamp(x > 0 ? x : 0);

export const sigmoid = (x: number, slope: number = 4.924273) =>
  1 / (1 + Math.exp(-slope * x));
