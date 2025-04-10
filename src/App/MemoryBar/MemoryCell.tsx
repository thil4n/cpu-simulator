const MemoryCell = ({ address, handleExamineMemory }) => {
    let hex = "0x" + address.toString(16).padStart(8, "0");

    let classList =
        "w-full border-b-2 border-slate-500 bg-primary text-secondary hover:bg-secondary hover:text-white  px-12 py-2   cursor-pointer text-center uppercase ";
    ("border-x-0");

    return (
        <div
            onClick={() => {
                handleExamineMemory(address);
            }}
            className={classList}
        >
            {hex}
        </div>
    );
};

export default MemoryCell;
