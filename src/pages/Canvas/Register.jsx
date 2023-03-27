import React from "react";

const Register = ({ register, handleClose }) => {
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
                    <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 w-[90%] mx-auto">
                        <div
                            onClick={(e) => {
                                e.stopPropagation();
                            }}
                            className="bg-white "
                        >
                            <div className="flex bg-secondery text-primary font-bold text-xl pl-3 w-full py-2">
                                <span className="uppercase mr-2">
                                    {register.key}
                                </span>
                                Register
                                <button
                                    onClick={handleClose}
                                    className="absolute right-2 h-7 w-7 shrink-0 items-center justify-center rounded-full text-muted transition-all duration-200 bg-gray-100 hover:text-red-600 focus:bg-gray-100 focus:text-red-600 focus:outline-none ltr:ml-3 ltr:-mr-2 rtl:mr-3 rtl:-ml-2"
                                >
                                    <svg
                                        className="h-3 w-3 mx-auto hover:fill-primary"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 20 20"
                                        fill="#000000"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </button>
                            </div>
                            <div className="w-full bg-slate-300 flex gap-1">
                                {cells.map((item) => {
                                    return (
                                        <div
                                            key={Math.random()}
                                            className="bg-primary w-full text-center"
                                        >
                                            {item}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        // <div>
        //     <div>{name}</div>
        //     <div className="w-full bg-slate-300 flex gap-1">
        //         {cells.map((item) => {
        //             return (
        //                 <div
        //                     key={Math.random()}
        //                     className="bg-primary w-full text-center"
        //                 >
        //                     {item}
        //                 </div>
        //             );
        //         })}
        //     </div>
        // </div>
    );
};

export default Register;
