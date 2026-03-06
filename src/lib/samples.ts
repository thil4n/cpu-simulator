export const samplePrograms: { [key: string]: string } = {
    Exit: `mov rax, 60
mov rdi, 0`,

    "Hello World (basic)": `mov rax, 5
mov rbx, 10
add rax, rbx`,

    Addition: `mov rax, 25
mov rbx, 17
add rax, rbx`,

    "Push/Pop": `mov rax, 42
push rax
mov rax, 0
pop rbx`,

    Subtraction: `mov rax, 100
sub rax, 30`,

    "XOR Swap": `mov rax, 15
mov rbx, 27
xor rax, rbx
xor rbx, rax
xor rax, rbx`,

    "Register Move": `mov rax, 255
mov rbx, rax
mov rcx, rbx`,

    "Stack Operations": `mov rax, 10
mov rbx, 20
push rax
push rbx
pop rcx
pop rdx`,

    "Arithmetic Mix": `mov rax, 50
mov rbx, 30
add rax, rbx
sub rax, 10`,

    "Zero Register": `mov rax, 123
xor rax, rax`,

    "Bit Manipulation": `mov rax, 255
and rax, 15
or rax, 240
not rax`,

    "Shift Operations": `mov rax, 1
shl rax, 4
shr rax, 2`,

    "Inc / Dec": `mov rcx, 10
dec rcx
dec rcx
inc rcx`,

    "Multiply & Divide": `mov rax, 12
mov rbx, 5
mul rbx
mov rax, 100
mov rbx, 7
div rbx`,

    "Compare & Jump": `mov rax, 5
mov rbx, 5
cmp rax, rbx
je 3
nop
nop`,

    "Exchange Regs": `mov rax, 111
mov rbx, 222
xchg rax, rbx`,

    "Load Address": `lea rax, 4096
lea rbx, 8192`,

    "Test & Branch": `mov rax, 0
test rax, rax
jne 3
mov rbx, 42`,

    "Negate Value": `mov rax, 50
neg rax
mov rbx, rax`,

    "IMUL Two-Operand": `mov rax, 6
mov rbx, 7
imul rax, rbx`,
};
