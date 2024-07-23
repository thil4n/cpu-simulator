import { Button } from "@components";

const Word = ({ value }) => {
    const binaryString = value.toString(2).padStart(64, "0");
    const bytes = [];

    for (let i = 0; i < 8; i++) {
        bytes.push(binaryString.slice(i * 8, (i + 1) * 8));
    }

    return (
        <div className="w-full px-2 flex mt-4 mb-6">
            {bytes.map((byte, index) => (
                <div
                    key={index}
                    className="bg-primary border border-slate-500 cursor-pointer text-secondary hover:bg-secondary hover:text-white text-sm w-full text-center mx-1"
                >
                    {byte}
                </div>
            ))}
        </div>
    );
};

export default Word;
