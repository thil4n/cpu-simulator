import React, { ReactNode } from "react";

interface ModalProps {
    handleClose: () => void;
    title: string;
    children: ReactNode;
    className?: string;
}

const Modal: React.FC<ModalProps> = ({
    children,
    handleClose,
    title,
    className = "",
}) => {
    return (
        <div className="relative z-10">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity overflow-y-auto">
                <div
                    className={`shadow-xl transition-all w-[25%] mx-auto mt-[100px] rounded-lg bg-[#2d3436] ${className}`}
                >
                    <div className="w-full bg-primary text-secondary text-md mb-6 flex items-center justify-between">
                        <h3 className="mx-auto py-1">{title}</h3>
                        <span
                            className="bg-slate-500 hover:bg-secondary px-3 py-1 cursor-pointer"
                            onClick={handleClose}
                        >
                            X
                        </span>
                    </div>
                    <div className="mt-2 mx-4">{children}</div>
                </div>
            </div>
        </div>
    );
};

export default Modal;
