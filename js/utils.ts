export const clamp = (val: number, min: number, max: number): number => Math.max(Math.min(val, max), min);

export const cleanInput = (msg: string): string => {
  return msg.replace(/\s+/g, '');
}
