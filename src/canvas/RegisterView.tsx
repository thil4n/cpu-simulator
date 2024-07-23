import { Button } from "@components";

const MemoryView = ({ register, handleClose }) => {
    let value = register.data;
    if (!value) {
        value = Math.floor(Math.random() * 1000) + 1;
    }
    const binaryString = value.toString(2).padStart(64, "0");
    const cells = binaryString.split("");

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
                            <div className=" bg-primary text-secondary text-center  font-bold text-xl pl-3 w-full py-2 uppercase">
                                Examine
                                {register && (
                                    <span>({register.key + " REGISTER"})</span>
                                )}
                            </div>
                            <div className="w-full px-2 flex mt-4 mb-6">
                                {cells.map((item) => {
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
                            <div className="w-full px-2 grid grid-cols-6 mt-4 mb-6 gap-2">
                                <Button text={"LEFT HALF"} />
                                <Button text={"RIGHT HALF"} />
                                <Button text={"FIRST 8 BITS"} />
                                <Button text={"SECOND 8 BITS"} />
                                <Button text={"THIRD 8 BITS"} />
                                <Button text={"FOURTH 8 BITS"} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MemoryView;
