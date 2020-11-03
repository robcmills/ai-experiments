export const createNumberGenerator = (numbers: number[]) => {
  let index = 0;
  return () => numbers[index++];
};
