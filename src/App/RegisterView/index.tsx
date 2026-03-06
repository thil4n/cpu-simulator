import { useRegisterContext } from "@context";
import BitSet from "./BitSet";

interface RegisterViewProps {
  register: string;
}

const create64BitArray = (): number[] => new Array(64).fill(0);

const getRegisterLabels = (register: string) => {
  // General purpose registers: rax, rbx, rcx, rdx
  const gpMap: { [key: string]: { r: string; e: string; w: string; lo: string; hi: string } } = {
    rax: { r: "RAX", e: "EAX", w: "AX", lo: "AL", hi: "AH" },
    rbx: { r: "RBX", e: "EBX", w: "BX", lo: "BL", hi: "BH" },
    rcx: { r: "RCX", e: "ECX", w: "CX", lo: "CL", hi: "CH" },
    rdx: { r: "RDX", e: "EDX", w: "DX", lo: "DL", hi: "DH" },
    rsi: { r: "RSI", e: "ESI", w: "SI", lo: "SIL", hi: "" },
    rdi: { r: "RDI", e: "EDI", w: "DI", lo: "DIL", hi: "" },
    rbp: { r: "RBP", e: "EBP", w: "BP", lo: "BPL", hi: "" },
    rsp: { r: "RSP", e: "ESP", w: "SP", lo: "SPL", hi: "" },
    rip: { r: "RIP", e: "EIP", w: "IP", lo: "", hi: "" },
    rflags: { r: "RFLAGS", e: "EFLAGS", w: "FLAGS", lo: "", hi: "" },
  };

  if (gpMap[register]) return gpMap[register];

  // r8-r15
  const upper = register.toUpperCase();
  return {
    r: upper,
    e: upper + "D",
    w: upper + "W",
    lo: upper + "B",
    hi: "",
  };
};

const RegisterView = ({ register }: RegisterViewProps) => {
  const { registers } = useRegisterContext();

  const registerData = registers[register] || create64BitArray();
  const labels = getRegisterLabels(register);

  const whole_register = registerData;
  const first_32_bits = registerData.slice(0, 32);
  const first_16_bits = registerData.slice(0, 16);
  const first_8_bits = registerData.slice(0, 8);
  const second_8_bits = registerData.slice(8, 16);

  return (
    <div className="w-full">
      <BitSet length={64} bits={whole_register} title={`${labels.r} (64-bit)`} />
      <BitSet length={32} bits={first_32_bits} title={`${labels.e} (32-bit)`} />
      <BitSet length={16} bits={first_16_bits} title={`${labels.w} (16-bit)`} />
      {labels.lo && (
        <BitSet length={8} bits={first_8_bits} title={`${labels.lo} (Low 8-bit)`} />
      )}
      {labels.hi && (
        <BitSet start={8} length={8} bits={second_8_bits} title={`${labels.hi} (High 8-bit)`} />
      )}
    </div>
  );
};

export default RegisterView;
