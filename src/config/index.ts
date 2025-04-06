export const STACK_START = 0x7fffffff; // Stack base address
export const STACK_SIZE = 1024 * 1024; // 1 MB stack
export const STACK_END = STACK_START - STACK_SIZE; // Stack grows downward
