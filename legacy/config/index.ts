// Stack - top of the memory
export const STACK_START = 0x7fffffff; // Stack base address
export const STACK_SIZE = 1024 * 1024; // 1 MB
export const STACK_END = STACK_START - STACK_SIZE; // Stack grows downward

// Text section - code
export const TXT_START = STACK_END - 0x100000; // Put it just below stack
export const TXT_SIZE = 1024 * 1024; // 1 MB
export const TXT_END = TXT_START + TXT_SIZE;
