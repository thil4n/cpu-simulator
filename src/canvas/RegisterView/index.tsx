import { useRegisterContext } from "@context";
import BitSet from "./BitSet";

interface RegisterViewProps {
    register: string;
}

const create64BitArray = (): number[] => new Array(64).fill(0);

const RegisterView = ({ register }: RegisterViewProps) => {
    const { registers } = useRegisterContext();

    const registerData = registers[register] || create64BitArray();

    const whole_register = registerData;
    const first_32_bits = registerData.slice(0, 32);
    const first_16_bits = registerData.slice(0, 16);
    const first_8_bits = registerData.slice(0, 8);
    const second_8_bits = registerData.slice(8, 16);

    const baseChar = register.toUpperCase()[1];

    return (
        <div className="w-full">
            <BitSet
                length={64}
                bits={whole_register}
                title={`R${baseChar}X Section`}
            />
            <BitSet
                length={32}
                bits={first_32_bits}
                title={`E${baseChar}X Section`}
            />
            <BitSet
                length={16}
                bits={first_16_bits}
                title={`${baseChar}X Section`}
            />
            <BitSet
                length={8}
                bits={first_8_bits}
                title={`${baseChar}L Section`}
            />
            <BitSet
                start={8}
                length={8}
                bits={second_8_bits}
                title={`${baseChar}H Section`}
            />
        </div>
    );
};

export default RegisterView;
