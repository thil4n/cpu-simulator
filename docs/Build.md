# CPU Simulator v2: Design

This document describes the v2 rebuild of the CPU simulator. The goal is to run real x86-64 assembly and **accurately** visualise the CPU, registers, stack, heap and the rest of process memory as each instruction executes.

The v1 code lives in [`legacy/`](../legacy) for reference while v2 is built. Delete it before merging `v2` into `master`.

## 1. Why a rebuild

v1 had structural problems that block accurate visualisation:

| Problem in v1 | Where | v2 answer |
|---|---|---|
| Execution logic runs inside React state, so a step reads stale `setState` values; the jump logic is written twice | `legacy/App/ExecutionController/index.tsx` | Pure synchronous engine with no React; the UI only renders snapshots |
| Registers are 64-element bit arrays, but the math uses 32-bit JS bitwise ops, so values ≥ 2³¹ are wrong | `legacy/instructions/*`, `legacy/utils` | `BigInt` registers, masked to the operand width |
| `rsp` starts at `STACK_END`, the bottom of the stack, so `push` writes outside the stack | `legacy/context/RegisterContext.tsx` | Loader builds a proper process image |
| No labels, memory operands, `call`/`ret`, sections, heap or syscalls | `legacy/lib/assembler.ts` | Two-pass assembler with sections and symbols |
| A REX prefix is added to every instruction, so the bytes aren't real x86 | `legacy/lib/assembler.ts` | Encodings checked against clang output |
| Encoder and decoder are separate hand-written switches that can drift apart | `assembler.ts`, `disassembler.ts` | One opcode table drives both |

## 2. Decisions

- **ISA:** an x86-64 subset in Intel syntax (NASM-style) with genuine byte encodings. The bytes in `.text` are what a real assembler would produce.
- **Heap:** a built-in `malloc`/`free` runtime that writes real chunk headers into simulated heap memory, on top of the `brk` syscall.
- **CPU view:** a single-cycle datapath with fetch → decode → execute → writeback phases.
- **Out of scope for v1:** pipelining, caches, the floating-point/SIMD instructions, and the full x86 instruction set.

## 3. Architecture

```
src/
  core/                 pure TypeScript, no React, fully unit tested
    types.ts            Reg, Width (8|16|32|64), Operand, Instruction, StepTrace
    registers.ts        16 GPRs + rip + rflags as BigInt; sub-register views
    flags.ts            CF PF ZF SF OF per op family
    memory.ts           sparse pages, regions with permissions, access tracking
    isa/
      table.ts          the single opcode table (encoder + decoder)
      encoder.ts        Instruction -> bytes
      decoder.ts        bytes -> Instruction + length
    exec/
      alu.ts            pure functions: (op, a, b, width) -> { result, flags }
      executor.ts       applies an Instruction to the machine, fills StepTrace
      syscalls.ts       write, brk, exit
      runtime.ts        native stubs: malloc, free, calloc, puts
    machine.ts          registers + memory + step(): StepTrace
  asm/
    lexer.ts
    parser.ts
    assembler.ts        two passes -> Program
  sim/
    loader.ts           Program -> process image + initial registers
    session.ts          step, stepBack, run, pause, reset, breakpoints, speed
    store.ts            external store (version counter) for useSyncExternalStore
  ui/
    App.tsx
    panels/             one folder per panel (section 8)
scripts/
  gen-fixtures.sh       dev-only golden encoding generator
```


## 8. UI

The UI is React + Tailwind. It subscribes to `sim/store.ts` through `useSyncExternalStore`, and each panel reads only what it needs.

| Panel | Shows |
|---|---|
| Editor | CodeMirror 6, an asm highlighting mode, breakpoint gutter, current-line highlight, assembler errors inline |
| CPU datapath | SVG: RIP → fetch → decoder → register file → ALU → writeback/memory. The active phase is lit and buses carry live values. The ALU shows a, b, the result and the flags. Phases animate at slow speed; at fast speed only the final state is shown. |
| Registers & flags | hex / unsigned / signed, a bit view, the sub-register breakdown, last-step changes highlighted |
| Memory map | all regions laid out vertically with `rip rsp rbp brk` markers; clicking a region jumps the hex dump there |
| Stack | 8-byte slots from `rsp` to the stack top, grouped into frames by walking the saved-`rbp` chain, return addresses resolved to symbols, slots labelled `[rbp-8]` |
| Heap | chunk strip (in use / free, sizes), the free list, corrupted headers flagged |
| Hex dump | coloured by region, reads flash blue and writes amber, ASCII column, can follow a register |
| Console & trace | program output, events, per-step trace; clicking a step jumps back to it |
| Controls | step, step back, run / pause, reset, speed, sample picker |

## 9. Build configuration changes

- Replace the v1 path aliases in `vite.config.ts` and `tsconfig.json` (`@components`, `@context`, …) with v2 ones such as `@core`, `@asm`, `@sim` and `@ui`.
- `tsconfig.json` targets ES2020, which supports `bigint` literals (`0n`).
- `index.html` loads `/src/main.tsx`. The app won't start until `src/main.tsx` exists again.
- **Dependencies:**
  - Add `vitest` (dev) and the CodeMirror 6 packages (`@codemirror/state`, `view`, `language`, `commands`).
  - Pin exact versions.
  - Keep `react`, `tailwindcss` and `lucide-react`.
  - Decide on `gh-pages` once a deployment target is chosen.

## 10. Milestones

1. **Core & ISA:** registers, flags, memory, opcode table, encoder, decoder, golden encoding tests.
2. **Assembler & executor:** the full v1 subset, syscalls and the loader. Program tests pass headless.
3. **Runtime & session:** malloc/free/calloc/puts, StepTrace, undo, breakpoints, run loop.
4. **UI shell:** layout, editor, controls, registers/flags, console/trace.
5. **Visual panels:** CPU datapath, memory map, stack, heap, hex dump.
6. **Content & polish:** sample programs with guided notes, mobile notice, README, deployment.

## 11. Testing

- **Golden encodings:** `scripts/gen-fixtures.sh` assembles a `.s` file that lists every supported instruction form. clang relaxes branches to rel8 when the target is close, so place the branch targets in the fixture file more than 127 bytes away (for example with `.skip 200`). That way clang emits the rel32 forms v1 uses. It uses `clang -target x86_64-linux-gnu -c` with `.intel_syntax noprefix`, then `objdump -d`, and writes the result to `src/core/isa/__fixtures__/encodings.json`. Commit the JSON so the tests never need clang. Tests assert `encode(line)` equals the expected bytes and that `decode(bytes)` round-trips.
- **ALU / flags:** signed overflow at `0x7fff…`, borrow on `sub`, 32-bit write zero-extension, shift by 0 leaving flags unchanged, division by zero.
- **Programs:** each runs on a headless `Machine`, then checks the exit code, stdout, and final registers/memory.
  - hello world via `write`
  - sum of 1..100
  - recursive factorial
  - iterative fibonacci
  - `strlen` over `.data`
  - bubble sort
  - linked list built with `malloc` then freed (checks merging, with the heap read back from memory)
  - stack overflow (expect a fault)
  - divide by zero (expect a fault)
- **Undo:** run N steps, step back N times, then registers and memory equal the initial state.
- **Build:** `npx tsc --noEmit`, `npm run lint`, `npm run build`.
- **Manual:** run `npm run dev` and step through factorial. Frames should grow and shrink, the `rsp`/`rbp` markers should move, the datapath should light each phase, and step back should restore the state. Then run the linked-list sample: chunks should appear and merge on `free`.
