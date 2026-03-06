import MemoryCell from "./MemoryCell";

interface MemoryBarProps {
    memoryRange: number[];
    handleExamineMemory: (address: number) => void;
}

const MemoryBar = ({ memoryRange, handleExamineMemory }: MemoryBarProps) => {
    return (
        <div
            className="h-screen  overflow-y-auto w-full col-span-2 "
            id="style-1"
        >
            {Array.isArray(memoryRange) &&
                memoryRange.map((address: number) => {
                    return (
                        <MemoryCell
                            address={address}
                            key={address}
                            handleExamineMemory={() => {
                                handleExamineMemory(address);
                            }}
                        />
                    );
                })}
        </div>
    );
};

export default MemoryBar;
