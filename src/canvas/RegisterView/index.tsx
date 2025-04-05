import { useMemoryContext } from "@context";

interface RegisterViewProps {
    register: string;
}

const RegisterView = ({ register }: RegisterViewProps) => {
    const { registers } = useMemoryContext();

    const registerData = registers[register];

    const formatIndex = (number: number): string => {
        const lastDigit = number % 10;
        const lastTwoDigits = number % 100;

        if (lastTwoDigits >= 11 && lastTwoDigits <= 13) {
            return `${number}th`;
        }

        switch (lastDigit) {
            case 1:
                return `${number}st`;
            case 2:
                return `${number}nd`;
            case 3:
                return `${number}rd`;
            default:
                return `${number}th`;
        }
    };

    const whole_register = registerData;
    const first_32_bits = registerData.slice(0, 32);
    const first_16_bits = registerData.slice(0, 16);
    const first_8_bits = registerData.slice(0, 8);
    const second_8_bits = registerData.slice(8, 16);

    const BitSet = ({ start = 0, length, bits, title }) => {
        let width = "w-full";

        if (length === 32) width = "w-[50%]";
        else if (length === 16) width = "w-[25%]";
        else if (length === 8) width = "w-[12.5%]";

        if (length === 8 && start === 8) width = "w-[25%]";

        return (
            <div className={`${width} flex`}>
                {start === 8 && <div className="w-[80%]"></div>}
                <div className="w-full flex flex-col justify-center items-center">
                    <div className="w-full p-2 flex gap-[3px] mt-4">
                        {bits.map((cell, index) => (
                            <div
                                key={index}
                                className="w-full cursor-pointer text-sm text-center border border-gray-500 rounded-sm hover:bg-secondary hover:text-white"
                                title={`${formatIndex(start + index + 1)} bit`}
                            >
                                {cell}
                            </div>
                        ))}
                    </div>
                    <p className="text-sm">{title}</p>
                </div>
            </div>
        );
    };
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
