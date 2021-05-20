export const clamp = (val: number, min: number, max: number): number => Math.max(Math.min(val, max), min);

export const getInput = (msg: string): string => {
  let input = null;
  while (!input) {
    input = (prompt(msg) ?? '').replace(/\s+/g, '');
  }
  return input;
}

export const sleep = (ms: number): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
