const MemoryView = ({ startAddr, memoryValues, handleClose }) => {
    const count = 20;
    const x = 1 ? 1 : 8;

    let cells = [];

    for (let i = 0; i < count; i++) {
        const addr = startAddr + i * x;

        // Convert binary string to hexadecimal
        const value = memoryValues[addr]
            ? parseInt(memoryValues[addr], 2).toString(16).padStart(2, "0")
            : Math.floor(Math.random() * 100)
                  .toString(16)
                  .padStart(2, "0");

        cells.push({
            addr,
            value,
        });
    }

    return (
        <div
            className="relative z-50"
            aria-labelledby="modal-title"
            role="dialog"
            aria-modal="true"
            onClick={handleClose}
        >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
            <div className="fixed inset-0 z-10 overflow-y-auto">
                <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                    <div className="relative transform overflow-hidden rounded-sm bg-[#555] bg-opacity-10 backdrop-blur-lg text-left shadow-xl transition-all sm:my-8 w-[70%] mx-auto">
                        <div
                            onClick={(e) => {
                                e.stopPropagation();
                            }}
                        >
                            <div className=" bg-primary text-secondary text-center font-bold pl-3 w-full py-1 uppercase">
                                Examine Memory
                            </div>
                            <div className="w-full px-2 grid grid-cols-8 gap-1 mt-4 mb-6">
                                {cells.map((item) => {
                                    return (
                                        <div
                                            key={item.addr}
                                            className="bg-primary border-r border-slate-500 cursor-pointer text-secondary hover:bg-secondary hover:text-white text-sm w-full text-center"
                                        >
                                            0x{item.value}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MemoryView;
