export const RESET = '\x1b[0m';

export function foreColor256(color: number): string {
  return `\x1b[38;5;${color}m`;
}
export function backColor256(color: number): string {
  return `\x1b[48;5;${color}m`;
}
