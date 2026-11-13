interface bitsetProps {
    start?: number;
    length: number;
    bits: number[];
    title: string;
}

const BitSet = ({ start = 0, length, bits, title }: bitsetProps) => {
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
                    {bits.map((value: number, index: number) => (
                        <div
                            key={index}
                            className="w-full cursor-pointer text-sm text-center border border-gray-500 rounded-sm hover:bg-secondary hover:text-white"
                            title={`${formatIndex(start + index + 1)} bit`}
                        >
                            {value}
                        </div>
                    ))}
                </div>
                <p className="text-sm">{title}</p>
            </div>
        </div>
    );
};

export default BitSet;
