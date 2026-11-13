# Decisions

- **ISA:** an x86-64 subset in Intel syntax (NASM-style) with genuine byte encodings. The bytes in `.text` are what a real assembler would produce.
- **Heap:** a built-in `malloc`/`free` runtime that writes real chunk headers into simulated heap memory, on top of the `brk` syscall.
- **CPU view:** a single-cycle datapath with fetch → decode → execute → writeback phases.
- **Out of scope for v1:** pipelining, caches, the floating-point/SIMD instructions, and the full x86 instruction set.


# CPU overview

The simulated CPU is an x86-64 processor in **64-bit long mode, user mode only** (ring 3).

| Component | Role |
|---|---|
| Register file | 16 general-purpose 64-bit registers, `rip`, `rflags` |
| Control unit / decoder | turns instruction bytes into an operation, operands and a length |
| Address generation | computes effective addresses `base + index*scale + disp` |
| ALU | integer arithmetic, logic and shifts; produces a result and flags |
| Memory interface | little-endian loads and stores of 1, 2, 4 or 8 bytes |

Properties of the model:

- **Flat memory.** Addresses are 64-bit virtual addresses, with no segmentation (`fs`/`gs` are not supported) and no visible paging. Only the region permissions in [Memory](#memory) apply.
- **Little-endian.** The lowest byte of a value is stored at the lowest address.
- **Unaligned access is allowed**, as on real x86 with alignment checking off.
- **One instruction per step.** There is no pipelining, no out-of-order execution and no cache. Each instruction completes fully before the next one starts.
- **Precise faults.** A faulting instruction changes nothing, and `rip` still points at it. See [Faults](#faults).


# Registers

## General-purpose registers

All registers are stored as `bigint` and masked to 64 bits.

| Register | Number | Conventional role | System V ABI role |
|---|---|---|---|
| `rax` | 0 | accumulator | return value; syscall number; caller-saved |
| `rcx` | 1 | counter (`shl rax, cl`) | 4th argument; destroyed by `syscall`; caller-saved |
| `rdx` | 2 | data, high half of `mul`/`div` | 3rd argument, 2nd return value; caller-saved |
| `rbx` | 3 | base | callee-saved |
| `rsp` | 4 | stack pointer | must stay 16-byte aligned at each `call` |
| `rbp` | 5 | frame (base) pointer | callee-saved |
| `rsi` | 6 | source index | 2nd argument; caller-saved |
| `rdi` | 7 | destination index | 1st argument; caller-saved |
| `r8` | 8 | | 5th argument; caller-saved |
| `r9` | 9 | | 6th argument; caller-saved |
| `r10` | 10 | | 4th **syscall** argument; caller-saved |
| `r11` | 11 | | destroyed by `syscall`; caller-saved |
| `r12`–`r15` | 12–15 | | callee-saved |

The **number** is the register's encoding. The low 3 bits go into ModRM, SIB or the opcode. Bit 3 (r8–r15) goes into REX.R, REX.X or REX.B (see [Instruction encoding](#instruction-encoding)).

## Sub-registers

| 64-bit | 32-bit | 16-bit | 8-bit low | 8-bit high |
|---|---|---|---|---|
| `rax` | `eax` | `ax` | `al` | `ah` |
| `rbx` | `ebx` | `bx` | `bl` | `bh` |
| `rcx` | `ecx` | `cx` | `cl` | `ch` |
| `rdx` | `edx` | `dx` | `dl` | `dh` |
| `rsi` | `esi` | `si` | `sil` | |
| `rdi` | `edi` | `di` | `dil` | |
| `rbp` | `ebp` | `bp` | `bpl` | |
| `rsp` | `esp` | `sp` | `spl` | |
| `r8`–`r15` | `r8d`–`r15d` | `r8w`–`r15w` | `r8b`–`r15b` | |

- Write semantics (these match real x86-64 and are easy to get wrong):
  - A 32-bit write **zero-extends** into the full 64-bit register (`mov eax, 1` clears the upper 32 bits).
  - 8- and 16-bit writes **preserve** the upper bits.
- `ah`/`bh`/`ch`/`dh` are bits 8–15 of their register.
- 8-bit register numbers 4–7 mean `ah ch dh bh` **without** a REX prefix and `spl bpl sil dil` **with** one. An instruction cannot use `ah`–`bh` together with any register that needs REX.

## Control registers

### `rip`, the instruction pointer

- Holds the address of the instruction to fetch.
- **During execution `rip` already points to the next instruction.** Relative branches and RIP-relative addresses are computed from that value, not from the start of the current instruction.
- `rip` cannot be named as an operand. Only `jmp`, `jcc`, `call` and `ret` write it, and it can be read only through RIP-relative addressing (`lea rax, [rip+x]`).

### `rflags`

| Bit | Flag | Name | Simulated? |
|---|---|---|---|
| 0 | CF | Carry | yes |
| 1 | — | reserved, always 1 | fixed |
| 2 | PF | Parity | yes |
| 4 | AF | Auxiliary carry (BCD) | no, reads 0 |
| 6 | ZF | Zero | yes |
| 7 | SF | Sign | yes |
| 8 | TF | Trap | no, 0 |
| 9 | IF | Interrupt enable | fixed at 1 |
| 10 | DF | Direction | no, 0 (no string instructions in v1) |
| 11 | OF | Overflow | yes |

The initial value at program start is `0x202` (IF plus the reserved bit), which is what Linux gives a new process.

## Flags

Status flag definitions. Every flag is computed at the **operand width** (8, 16, 32 or 64 bits), not at 64 bits.

- **ZF**: the result is 0.
- **SF**: the most significant bit of the result (the sign bit at that width).
- **PF**: the **low 8 bits** of the result contain an even number of 1 bits.
- **CF**: unsigned overflow. Carry out of (or borrow into) the top bit.
- **OF**: signed overflow. The result doesn't fit in the signed range of that width.

The executor computes CF, PF, ZF, SF and OF per op family:

| Family | CF | OF | SF ZF PF |
|---|---|---|---|
| add | unsigned carry out | signs of a and b match and the result sign differs | from result |
| inc | **unchanged** | same as add | from result |
| sub / cmp | borrow, `a < b` unsigned | signs of a and b differ and the result sign differs from a | from result |
| dec | **unchanged** | same as sub | from result |
| neg | 1 unless the operand was 0 | 1 only when the operand is the minimum signed value | from result |
| and / or / xor / test | 0 | 0 | from result |
| shl / sal | last bit shifted out | count 1: MSB(result) XOR CF | from result |
| shr | last bit shifted out | count 1: MSB of the original operand | from result |
| sar | last bit shifted out | count 1: 0 | from result |
| mul | high half ≠ 0 | same as CF | undefined |
| imul | result doesn't fit when truncated | same as CF | undefined |
| div / idiv | undefined | undefined | undefined |

Shift details:

- The count is masked to 6 bits for 64-bit operands, and to 5 bits otherwise.
- A masked count of 0 leaves **all** flags unchanged.
- OF is undefined for counts greater than 1.

**Instructions that do not change flags:** `mov`, `movzx`, `movsx`, `movsxd`, `lea`, `xchg`, `push`, `pop`, `not`, `cqo`, `jmp`, `jcc`, `call`, `ret`, `leave`, `setcc`, `nop`. `not` is the one most often implemented wrongly.

Where Intel leaves a flag undefined, pick one consistent value and document it in `flags.ts`. The suggested choice is to leave the flag unchanged.

## Condition codes

`jcc` and `setcc` test one of 16 conditions. The 4-bit code `cc` is added to the base opcode.

| cc | Mnemonics | Condition | Meaning |
|---|---|---|---|
| 0 | `jo` | OF = 1 | overflow |
| 1 | `jno` | OF = 0 | no overflow |
| 2 | `jb` `jc` `jnae` | CF = 1 | below (unsigned <) |
| 3 | `jae` `jnc` `jnb` | CF = 0 | above or equal (unsigned ≥) |
| 4 | `je` `jz` | ZF = 1 | equal / zero |
| 5 | `jne` `jnz` | ZF = 0 | not equal / not zero |
| 6 | `jbe` `jna` | CF = 1 or ZF = 1 | below or equal (unsigned ≤) |
| 7 | `ja` `jnbe` | CF = 0 and ZF = 0 | above (unsigned >) |
| 8 | `js` | SF = 1 | negative |
| 9 | `jns` | SF = 0 | not negative |
| A | `jp` `jpe` | PF = 1 | parity even |
| B | `jnp` `jpo` | PF = 0 | parity odd |
| C | `jl` `jnge` | SF ≠ OF | less (signed <) |
| D | `jge` `jnl` | SF = OF | greater or equal (signed ≥) |
| E | `jle` `jng` | ZF = 1 or SF ≠ OF | less or equal (signed ≤) |
| F | `jg` `jnle` | ZF = 0 and SF = OF | greater (signed >) |

`setcc` uses the same suffixes (`sete`, `setl`, …).

- `above`/`below` compare **unsigned** values.
- `greater`/`less` compare **signed** values.


# Memory

- Sparse 4 KiB pages: `Map<pageNumber, Uint8Array>`. Only mapped pages exist.
- Named regions `{ name, start, end, perms: 'r' | 'w' | 'x' }`. An access outside any region, or without the needed permission, raises a **fault**. Faults appear as a trace event instead of crashing the app.
- Little-endian `read(addr, size)` / `write(addr, size, value)` for sizes 1, 2, 4 and 8.
- Every access during a step is recorded into that step's trace, as reads or as writes with before/after bytes.
- An instruction fetch from a region without `x` faults, just as with the NX bit on real hardware.

## Addressing modes

A memory operand's **effective address** is:

```
EA = base + index × scale + displacement
```

- **base**: any 64-bit GPR (optional).
- **index**: any 64-bit GPR **except `rsp`** (optional).
- **scale**: 1, 2, 4 or 8.
- **displacement**: a signed 8- or 32-bit constant, sign-extended to 64 bits.

| Form | Example | Notes |
|---|---|---|
| register indirect | `[rax]` | |
| base + disp | `[rbp-8]` | locals and arguments |
| base + index×scale | `[rbx+rcx*8]` | array element |
| base + index×scale + disp | `[rbx+rcx*8+16]` | field of an array element |
| absolute | `[0x601000]`, `[label]` | disp32 only, encoded with a SIB byte; the address must fit in a sign-extended 32-bit value (true for this layout) |
| RIP-relative | `[rip+disp32]` | address = next instruction + disp32 |

- Addresses are 64-bit. The `0x67` address-size prefix is not supported.
- `lea` computes the effective address **without** accessing memory.

## Process memory layout

| Region | Address | Perms | Notes |
|---|---|---|---|
| `.text` | `0x400000` | r-x | |
| `.data`, `.bss` | next page boundary after `.text` | rw- | |
| heap | page after `.bss`, grows up | rw- | initial `brk` = heap start |
| native stubs | `0x7f0000000000` | --x | one trap address per runtime function |
| stack | top `0x7ffffffff000`, 64 KiB | rw- | unmapped guard page below, so overflow faults visibly |

The loader:
1. Maps each section and copies its bytes in.
2. Sets `rsp` to the stack top, 16-byte aligned.
3. If `main` exists, it pushes the address of an exit stub as `main`'s return address. A `ret` from `main` then exits with `rax` as the status. This also leaves `rsp ≡ 8 (mod 16)` at `main`'s entry, just as if `main` had been reached by a `call`.
4. Sets `rip` to `main`, else `_start`, else the start of `.text`.
5. Sets every other GPR to 0 and `rflags` to `0x202`.


# Stack and calls

The stack grows **down**, towards lower addresses. `rsp` points at the last value pushed.

| Instruction | Effect |
|---|---|
| `push src` | `rsp -= 8; [rsp] = src` (immediates are sign-extended to 64 bits) |
| `pop dst` | `dst = [rsp]; rsp += 8` |
| `call target` | `push` the address of the next instruction, then `rip = target` |
| `ret` | `rip = pop` |
| `leave` | `rsp = rbp; rbp = pop` |

For `push`, the address is computed from the old `rsp`. If the write faults, `rsp` must not change.

## Stack frame (System V AMD64)

```
higher addresses
  [rbp+24]  8th integer argument (if any)
  [rbp+16]  7th integer argument (if any)
  [rbp+8]   return address           pushed by call
  [rbp]     caller's saved rbp       pushed by the prologue   <- rbp
  [rbp-8]   first local
  ...
  [rsp]     top of stack                                      <- rsp
lower addresses
```

```asm
func:
    push rbp          ; prologue
    mov  rbp, rsp
    sub  rsp, 16      ; space for locals, keeping rsp 16-byte aligned
    ...
    leave             ; epilogue: mov rsp, rbp / pop rbp
    ret
```

- **Arguments:** the first six integer arguments go in `rdi, rsi, rdx, rcx, r8, r9`. Any more are pushed right to left, so the 7th argument ends up at `[rbp+16]`.
- **Return value:** `rax` (and `rdx` for 128-bit values).
- **Callee-saved:** `rbx, rbp, r12–r15`. A function must restore them before `ret`. All other GPRs may be clobbered.
- **Alignment:** `rsp` is a multiple of 16 just before each `call`, so at function entry `rsp ≡ 8 (mod 16)`.
- **Red zone:** the 128 bytes below `rsp` may be used by leaf functions without moving `rsp`. Nothing in the simulator writes there asynchronously, so it is always safe.
- The stack view finds frames by following the saved-`rbp` chain: `[rbp]` holds the previous `rbp`, and `[rbp+8]` holds the return address. Code that doesn't keep a frame pointer won't show separate frames.


# Instruction encoding

## Format

```
[prefixes] [REX] [opcode 1–3 bytes] [ModRM] [SIB] [displacement 0/1/4] [immediate 0/1/2/4/8]
```

An instruction is at most **15 bytes**. The only prefix used in v1 is `0x66` (16-bit operand size).

**REX** (`0x40`–`0x4F`) = `0100 W R X B`

| Bit | Meaning |
|---|---|
| W | 64-bit operand size |
| R | bit 3 of ModRM.reg |
| X | bit 3 of SIB.index |
| B | bit 3 of ModRM.rm, SIB.base, or the register in the opcode (`50+r`) |

**ModRM** = `mod(2) reg(3) rm(3)`

| mod | Meaning |
|---|---|
| `00` | `[rm]`, no displacement. Special cases: `rm=100` means a SIB byte follows; `rm=101` means `[rip+disp32]` |
| `01` | `[rm + disp8]` (`rm=100` means SIB) |
| `10` | `[rm + disp32]` (`rm=100` means SIB) |
| `11` | `rm` is a register, not memory |

`reg` holds either the second register operand or, in `/digit` encodings, an opcode extension (for example `81 /5` = `sub`).

**SIB** = `scale(2) index(3) base(3)`. `scale` is `00`=1, `01`=2, `10`=4, `11`=8. `index=100` (without REX.X) means no index. `base=101` with `mod=00` means no base, use disp32 instead.

### Worked example

`mov qword ptr [rbx+rcx*8+16], rax` → `48 89 44 CB 10`

| Byte | Bits | Meaning |
|---|---|---|
| `48` | `0100 1000` | REX.W: 64-bit operand |
| `89` | | `mov r/m64, r64` |
| `44` | `01 000 100` | mod=01 (disp8), reg=000 (`rax`), rm=100 (SIB follows) |
| `CB` | `11 001 011` | scale=8, index=001 (`rcx`), base=011 (`rbx`) |
| `10` | | disp8 = 16 |

## Opcode table

A single table describes every supported form, for example:

```ts
{ mnem: 'add', ops: ['r/m64', 'imm32'], opcode: [0x81], ext: 0, rexW: true }
{ mnem: 'add', ops: ['r/m64', 'r64'],   opcode: [0x01], rexW: true }
{ mnem: 'push', ops: ['r64'],           opcode: [0x50], plusReg: true }
```

The encoder picks an entry whose operand pattern matches, using the selection rules below. The decoder indexes the same table by opcode, plus the ModRM.reg extension where the entry has one.

## Encoding rules that often cause bugs

- **REX** = `0100WRXB`. Emit it only when needed:
  - W for 64-bit operand size.
  - R, X or B when r8–r15 appear in ModRM.reg, SIB.index, or ModRM.rm / SIB.base / the opcode register.
  - Also for `spl bpl sil dil`.
  - `ah ch dh bh` **cannot** be encoded when a REX prefix is present.
- `push` / `pop` default to 64-bit and take **no** REX.W. REX.B is used for r8–r15.
- `0x66` selects a 16-bit operand size.
- **ModRM special cases:**
  - `rm=100` means a SIB byte follows, so `[rsp]` and `[r12]` always need a SIB byte.
  - `mod=00, rm=101` means RIP-relative disp32, so `[rbp]` and `[r13]` must be encoded as `mod=01` with disp8 = 0.
- Use disp8 when the displacement fits in a signed byte, else disp32.
- 64-bit ALU immediates are **imm32 sign-extended**. Only `mov r64, imm64` takes a full 64-bit immediate.
- Relative branches are computed from the address of the **next** instruction.
  - `jmp rel32` = `E9`, `call rel32` = `E8`, `jcc rel32` = `0F 80+cc`.
  - v1 always uses rel32. Short-jump relaxation can come later.

## Form selection (match clang/LLVM)

The golden tests compare against clang. When an instruction has several valid encodings, choose the one LLVM chooses. NASM sometimes differs: for example NASM with `-Ox` turns `mov rax, 5` into `mov eax, 5`.

| Case | Choice | Example |
|---|---|---|
| reg, reg (mov / ALU / test / xchg) | the `r/m, r` form | `mov rax, rbx` = `48 89 D8` |
| ALU op, imm fits a signed byte | `83 /n ib` | `add rax, 5` = `48 83 C0 05` |
| ALU op on `al`/`ax`/`eax`/`rax`, larger imm | short accumulator form | `add eax, 1000` = `05 E8 03 00 00`, `cmp rax, 1000` = `48 3D …` |
| ALU op on other registers, larger imm | `81 /n id` (8-bit operands: `80 /n ib`, or the accumulator form for `al`) | `add bl, 5` = `80 C3 05`, `add al, 5` = `04 05` |
| `test` with imm | `A8`/`A9` for the accumulator, else `F6 /0` / `F7 /0` | `test rax, 1` = `48 A9 01 00 00 00` |
| `xchg` involving `rax` | `90+r` | `xchg rax, rbx` = `48 93` |
| `mov r64, imm` fits a sign-extended imm32 | `REX.W C7 /0 id` | `mov rax, -1` = `48 C7 C0 FF FF FF FF` |
| `mov r64, imm` larger | `REX.W B8+r io` (objdump shows `movabs`) | `mov rax, 0x80000000` = `48 B8 00 00 00 80 00 00 00 00` |
| `mov r32, imm` | `B8+r id` (zero-extends) | `mov ecx, 7` = `B9 07 00 00 00` |
| `push imm` | `6A ib` if it fits a byte, else `68 id` | `push 5` = `6A 05` |
| shift by 1 | `D1 /n` (not `C1 /n 01`) | `shl rax, 1` = `48 D1 E0` |
| `imul r, r/m, imm` | `6B ib` if it fits a byte, else `69 id` | `imul rax, rbx, 10` = `48 6B C3 0A` |


# Instruction subset (v1)

Notation:
- `/n`: ModRM.reg holds the opcode extension `n`.
- `+r`: the register number is added to the opcode.
- `ib` / `id` / `io`: an 8-, 32- or 64-bit immediate.
- Wherever two opcodes are listed (e.g. `88`/`89`), the first is the 8-bit form and the second is the 16/32/64-bit form. 16-bit adds `66`, and 64-bit adds REX.W unless noted.

Flags column:
- **arith** means CF OF SF ZF PF are all set from the result.
- **logic** means CF = OF = 0 and SF ZF PF come from the result.
- **—** means no flags change.

## Data

| Instruction | Encodings | Operation | Flags |
|---|---|---|---|
| `mov` | `88`/`89` r/m←r; `8A`/`8B` r←r/m; `C6`/`C7 /0` r/m←imm; `B0+r`/`B8+r` r←imm (REX.W `B8+r io` for imm64) | `dst = src` | — |
| `movzx` | `0F B6` (from r/m8), `0F B7` (from r/m16) | zero-extend | — |
| `movsx` | `0F BE` (from r/m8), `0F BF` (from r/m16) | sign-extend | — |
| `movsxd` | REX.W `63` | sign-extend r/m32 to r64 | — |
| `lea` | `8D` | `dst = EA` (no memory access) | — |
| `xchg` | `86`/`87`; `90+r` with `rax` | swap | — |
| `push` | `50+r`; `FF /6`; `6A ib`; `68 id` | see [Stack and calls](#stack-and-calls) | — |
| `pop` | `58+r`; `8F /0` | see [Stack and calls](#stack-and-calls) | — |

## Arithmetic

| Instruction | Encodings | Operation | Flags |
|---|---|---|---|
| `add` | `00`–`03`; `04`/`05`; `80`/`81`/`83 /0` | `dst += src` | arith |
| `sub` | `28`–`2B`; `2C`/`2D`; `80`/`81`/`83 /5` | `dst -= src` | arith |
| `cmp` | `38`–`3B`; `3C`/`3D`; `80`/`81`/`83 /7` | `dst - src`, result discarded | arith |
| `inc` | `FE`/`FF /0` | `dst += 1` | arith, CF unchanged |
| `dec` | `FE`/`FF /1` | `dst -= 1` | arith, CF unchanged |
| `neg` | `F6`/`F7 /3` | `dst = 0 - dst` | arith, CF = (dst ≠ 0) |
| `mul` | `F6`/`F7 /4` | unsigned `rdx:rax = rax × src` | CF = OF = (high ≠ 0) |
| `imul` | `F6`/`F7 /5` (1 operand); `0F AF` (2); `6B ib` / `69 id` (3) | signed multiply. The 1-operand form works like `mul`; the 2- and 3-operand forms keep only the low half | CF = OF = truncated |
| `div` | `F6`/`F7 /6` | unsigned: `rax = rdx:rax ÷ src`, `rdx = remainder` | undefined |
| `idiv` | `F6`/`F7 /7` | signed; the quotient rounds toward 0, and the remainder takes the dividend's sign | undefined |
| `cqo` | REX.W `99` | `rdx` = copy of `rax`'s sign bit (all 0s or all 1s) | — |

`div`/`idiv` by zero, or a quotient that doesn't fit (including `INT_MIN / -1`), raises **#DE**.

For other operand widths, `mul`/`div` use: 8-bit `ax = al × src`, `al = ax ÷ src`, `ah = remainder`; 16-bit `dx:ax`; 32-bit `edx:eax`.

## Logic

| Instruction | Encodings | Operation | Flags |
|---|---|---|---|
| `and` | `20`–`23`; `24`/`25`; `80`/`81`/`83 /4` | `dst &= src` | logic |
| `or` | `08`–`0B`; `0C`/`0D`; `80`/`81`/`83 /1` | `dst \|= src` | logic |
| `xor` | `30`–`33`; `34`/`35`; `80`/`81`/`83 /6` | `dst ^= src` | logic |
| `test` | `84`/`85`; `A8`/`A9`; `F6`/`F7 /0` | `dst & src`, result discarded | logic |
| `not` | `F6`/`F7 /2` | `dst = ~dst` | **—** |
| `shl` / `sal` | `D0`/`D1 /4` (by 1); `D2`/`D3 /4` (by `cl`); `C0`/`C1 /4 ib` | shift left | see [Flags](#flags) |
| `shr` | same forms, `/5` | logical shift right (fills with 0) | see [Flags](#flags) |
| `sar` | same forms, `/7` | arithmetic shift right (copies the sign bit) | see [Flags](#flags) |

`xor eax, eax` (`31 C0`) is the idiomatic way to zero `rax`. The 32-bit write zero-extends to all 64 bits.

## Control

| Instruction | Encodings | Operation | Flags |
|---|---|---|---|
| `jmp` | `E9 rel32`; `EB rel8`; `FF /4` (r/m) | `rip = target` | — |
| `jcc` | `0F 80+cc rel32`; `70+cc rel8` | if the condition holds: `rip = target` | — |
| `call` | `E8 rel32`; `FF /2` (r/m) | push next `rip`, `rip = target` | — |
| `ret` | `C3` | `rip = pop` | — |
| `leave` | `C9` | `rsp = rbp; rbp = pop` | — |
| `setcc` | `0F 90+cc /0` (r/m8) | `dst8 = condition ? 1 : 0` | — |

The assembler emits only the rel32 branch forms. The decoder should still accept `EB` and `70+cc`, so that bytes from other sources can be read.

## Misc

| Instruction | Encoding | Operation |
|---|---|---|
| `nop` | `90` | nothing |
| `syscall` | `0F 05` | system call (see [Syscalls](#syscalls-linux-x86-64-numbers)) |
| `hlt` | `F4` | stops the machine (see [Faults](#faults)) |

## Operand sizes

- Operands can be 8, 16, 32 or 64 bits wide.
- Use `byte`/`word`/`dword`/`qword` on memory operands (`ptr` is optional).
- A memory operand combined with an immediate (`mov [rax], 5`) has no implied size, so the size keyword is **required**. Without it, report an assembler error.


# Faults

Faults are **precise**:
- The faulting instruction makes no changes to registers, flags or memory.
- `rip` is left pointing at the faulting instruction.
- The machine stops and records a `fault` trace event.

To get this, the executor checks every memory access an instruction will make **before** it commits any write. The alternative is to roll back using that step's trace.

| Fault | Cause | What Linux would do |
|---|---|---|
| #DE divide error | `div`/`idiv` by 0, or the quotient doesn't fit | `SIGFPE` |
| #PF page fault | access to an unmapped address (including the stack guard page), a write to a read-only region, or a fetch from a non-executable region | `SIGSEGV` |
| #UD invalid opcode | bytes that don't decode to a supported instruction | `SIGILL` |

**Deliberate deviation:** a real CPU raises #GP (`SIGSEGV`) for `hlt` in user mode. The simulator treats `hlt` as a clean stop instead, so short examples can end without a syscall.


# Assembler

- **Syntax:** NASM-style Intel syntax, with case-insensitive mnemonics and registers.
- **Supported:** labels (`name:`), `section .text|.data|.bss`, `global`, `equ`, `db dw dd dq` (numbers, `'c'`, `"strings"` with `\n \t \0 \\` escapes), `resb resw resd resq`, and comments with `;`.
- **Numbers:** decimal, `0x` hex, `0b` binary, and negative values.
- **Memory operands:** `[base + index*scale + disp]`, where scale is 1, 2, 4 or 8, and disp may be a label or `label ± const`.
- **Pass 1:** parse lines and compute each instruction's size. Sizes don't depend on label values because v1 uses fixed rel32 branches. Then assign addresses per section and build the symbol table.
- **Pass 2:** resolve symbols and encode.
- **Output:**

  ```ts
  interface Program {
    sections: { name: string; base: bigint; bytes: Uint8Array }[];
    symbols: Map<string, bigint>;
    sourceMap: { addr: bigint; line: number; length: number }[];
    errors: { line: number; col: number; message: string }[];
  }
  ```

  Collect errors instead of throwing on the first one, so the editor can show all of them.
- External symbols `malloc`, `free`, `calloc` and `puts` resolve to native stub addresses.

**Watch out:** a `[label]` operand whose size depends on the label's value would break pass 1. Always encode a label displacement as disp32 (absolute or RIP-relative), even when the value would fit in disp8.


# Execution

## Step

`machine.step()` runs one instruction:

1. **Fetch:** read up to 15 bytes at `rip`. Stop early at the end of the executable region; the fetch faults (#PF) only if the decoder needs bytes beyond it.
2. **Decode:** look the bytes up in the opcode table to get the `Instruction` and its length. Set the internal "next rip" = `rip + length`.
3. **Execute:**
   - Compute effective addresses. RIP-relative addresses use the next rip.
   - Read the operands.
   - Run the ALU.
   - Check every memory access for faults.
4. **Writeback:**
   - Write registers or memory and update flags.
   - Set `rip` to the next rip, or to the branch target if a branch was taken.

Each phase records what it did into the `StepTrace`. The datapath view replays those phases.

## StepTrace

This one structure drives every visualisation and the step-back feature:

```ts
interface StepTrace {
  rip: bigint;
  bytes: Uint8Array;
  instr: Instruction;
  text: string;                 // disassembly
  line?: number;                // source line
  regWrites: { reg: Reg; before: bigint; after: bigint }[];
  flags: { before: bigint; after: bigint };
  memReads:  { addr: bigint; size: number; value: bigint; region: string }[];
  memWrites: { addr: bigint; before: Uint8Array; after: Uint8Array; region: string }[];
  alu?: { op: string; a: bigint; b: bigint; result: bigint };
  event?: { kind: 'syscall' | 'native' | 'fault' | 'exit'; detail: string };
}
```

**Undo** applies `memWrites[].before` and `regWrites[].before` in reverse order. History is a ring buffer of traces (for example the last 10,000 steps). No full snapshots are kept.

## Syscalls (Linux x86-64 numbers)

- **Arguments:** the syscall number goes in `rax`; arguments go in `rdi, rsi, rdx, r10, r8, r9`. The 4th argument is `r10`, not `rcx` as in normal calls.
- **The `syscall` instruction itself** sets `rcx` = next `rip` and `r11` = `rflags`. Programs must assume both are destroyed.
- **Return value:** `rax`. Errors are returned as `-errno`, a value between -4095 and -1.

| rax | Call | Behaviour |
|---|---|---|
| 1 | `write(fd, buf, len)` | fd 1 and 2 go to the console; returns `len` |
| 12 | `brk(addr)` | grows or shrinks the heap region; `brk(0)` returns the current break |
| 60 | `exit(code)` | stops the machine with that status |

## Native runtime

- Each runtime function has a stub address in the native region. When `rip` reaches a stub, the machine runs the TypeScript implementation instead of decoding bytes, and records one `native` trace step.
- The implementation reads its arguments from `rdi`/`rsi` and does **all heap updates through `memory.ts`**, so they show up as normal memory writes. It sets `rax`, then performs a real `ret` by popping the return address.
- Native functions follow the System V rules. They may clobber the caller-saved registers, but the v1 implementation only writes `rax`, so the trace stays easy to read.
- **Allocator** (simplified glibc style):
  - Each chunk is an 8-byte header followed by the payload.
  - The header holds the chunk size (a multiple of 16) with bit 0 = in use.
  - Payloads are 16-byte aligned. The minimum chunk size is 32.
  - Free chunks store `next` / `prev` pointers in the payload, forming an explicit free list.
  - `malloc` does first fit, splits when the leftover is ≥ 32, and calls `brk` to grow the heap when nothing fits.
  - `free` clears the in-use bit and merges with neighbouring free chunks.
- `puts(str)` writes the string plus `\n` to the console.
- The **heap view parses chunks from memory**, not from allocator state. A program that overflows a buffer and corrupts the next header shows the corruption.
