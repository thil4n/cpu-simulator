import { useMemoryContext } from "@context";

interface RegisterViewProps {
    register: string;
}

const RegisterView = ({ register }: RegisterViewProps) => {
    const { registers } = useMemoryContext();

    const registerData = [
        1,
        0,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1, // first 16
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1, // sdfsd
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1, // sdfsd
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1, // sdfsd
    ];

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

    return (
        <div className="w-full">
            <div className="w-full p-2 grid grid-cols-64 gap-1 mt-4 mb-6">
                {whole_register.map((cell, index) => (
                    <div
                        key={index}
                        className="cursor-pointer text-sm text-center border border-gray-500 rounded-sm hover:bg-secondary hover:text-white"
                    >
                        {cell}
                    </div>
                ))}
            </div>
            <div className="w-full p-2 grid grid-cols-64 gap-1 mt-4 mb-6 border-t-2 border-primary">
                {first_32_bits.map((cell, index) => (
                    <div
                        key={index}
                        className="cursor-pointer text-sm text-center border border-gray-500 rounded-sm hover:bg-secondary hover:text-white"
                        title={formatIndex(index + 1) + " bit"}
                    >
                        {cell}
                    </div>
                ))}
            </div>
            <div className="w-full p-2 grid grid-cols-64 gap-1 mt-4 mb-6 border-t-2 border-primary">
                {first_16_bits.map((cell, index) => (
                    <div
                        key={index}
                        className="cursor-pointer text-sm text-center border border-gray-500 rounded-sm hover:bg-secondary hover:text-white"
                        title={formatIndex(index + 1) + " bit"}
                    >
                        {cell}
                    </div>
                ))}
            </div>
            <div className="w-full p-2 grid grid-cols-64 gap-1 mt-4 mb-6 border-t-2 border-primary">
                {first_8_bits.map((cell, index) => (
                    <div
                        key={index}
                        className="cursor-pointer text-sm text-center border border-gray-500 rounded-sm hover:bg-secondary hover:text-white"
                        title={formatIndex(index + 1) + " bit"}
                    >
                        {cell}
                    </div>
                ))}
            </div>
            <div className="w-full p-2 grid grid-cols-64 gap-1 mt-4 mb-6 border-t-2 border-primary">
                <span className="col-span-8"></span>
                {second_8_bits.map((cell, index) => (
                    <div
                        key={index}
                        className="cursor-pointer text-sm text-center border border-gray-500 rounded-sm hover:bg-secondary hover:text-white"
                        title={formatIndex(index + 8 + 1) + " bit"}
                    >
                        {cell}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RegisterView;
