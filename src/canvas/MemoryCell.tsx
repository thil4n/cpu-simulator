const MemoryCell = ({ cell, handleExamineMemory, value }) => {
    let hex = "0x" + cell.address.toString(16).padStart(8, "0");

    let classList =
        "w-full border-b-2 border-slate-500 bg-primary text-secondary hover:bg-secondary hover:text-white  px-12 py-2   cursor-pointer text-center uppercase ";
    classList += cell.highlight ? "border-x-2 border-x-red-500" : "border-x-0";
    //console.log(cell.address + " : " + value);

    return (
        <div
            onClick={() => {
                handleExamineMemory({
                    startAddr: cell.address,
                    wordCount: 1,
                });
            }}
            className={classList}
        >
            {hex}
        </div>
    );
};

export default MemoryCell;
