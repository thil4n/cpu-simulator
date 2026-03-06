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
};
