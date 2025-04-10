import MemoryCell from "./MemoryCell";

const MemoryBar = ({ memoryRange, handleExamineMemory }) => {
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
