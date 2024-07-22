import React from "react";

const MemoryCell = ({ cell, handleClick }) => {
    let hex = "0x" + cell.address.toString(16).padStart(8, "0");

    let classList =
        "w-full border-b-2 border-slate-500 bg-primary text-secondary hover:bg-secondary hover:text-white  px-12 py-2   cursor-pointer text-center uppercase ";
    classList += cell.highlight ? "bg-[#ccc]" : "bg-primary]";

    return (
        <div
            // onClick={() => handleClick(register)}
            className={classList}
        >
            {hex}
        </div>
    );
};

export default MemoryCell;
