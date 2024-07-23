import { Button } from "@components";

const Word = ({ value }) => {
    if (!value) {
        value = Math.floor(Math.random() * 1000) + 1;
    }
    const binaryString = value.toString(2).padStart(64, "0");
    const bits = binaryString.split("");

    return (
        <div className="w-full px-2 flex mt-4 mb-6">
            {bits.map((item) => {
                return (
                    <div
                        key={Math.random()}
                        className="bg-primary border-r border-slate-500 cursor-pointer text-secondary hover:bg-secondary hover:text-white text-sm w-full text-center"
                    >
                        {item}
                    </div>
                );
            })}
        </div>
    );
};

export default Word;
