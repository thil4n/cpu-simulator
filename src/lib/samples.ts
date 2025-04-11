export const samplePrograms = {
    "Exit": 
      `mov rbx, 1
      mov rdx, 13
      syscall`,
  
    "Hello World (basic)": 
      `mov rax, 1
      mov rdi, 1
      mov rsi, msg
      mov rdx, 13
      syscall`,
  
    "Addition": 
      `mov rax, 5
      add rax, 10`,
  
    "Push/Pop": 
      `push rbx
      mov rbx, 7
      pop rbx`,
  
    "Subtraction": 
      `mov rax, 20
      sub rax, 5`,
  
    "Multiplication": 
      `mov rax, 6
      mov rbx, 3
      mul rbx`,
  
    "Division": 
      `mov rax, 20
      mov rbx, 4
      xor rdx, rdx
      div rbx`,
  
    "Increment/Decrement": 
      `mov rax, 5
      inc rax
      dec rax`,
  
    "Memory Access": 
      `mov rax, [var1]
      add rax, [var2]`,
  
    "Stack Manipulation": 
      `push rax
      push rbx
      pop rbx
      pop rax`,
  };
  