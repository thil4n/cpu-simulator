import React, { MouseEvent } from "react";

interface ButtonProps {
    handleClick: () => void;
    className?: string;
    text: string;
    disabled?: boolean;
    loading?: boolean;
}

const Button: React.FC<ButtonProps> = ({
    handleClick,
    className = "",
    text,
    disabled = false,
    loading = false,
}) => {
    const handleClickWrapper = (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        handleClick();
    };

    return (
        <button
            onClick={handleClickWrapper}
            className={`border-1 text-sm 
                        rounded-sm mb-2 w-full border-2 border-slate-500 bg-primary
                         text-secondary hover:bg-secondary hover:text-white  px-2 py-2
                        cursor-pointer text-center uppercase ${className}`}
            disabled={disabled || loading}
        >
            {loading ? <div className="loader"></div> : text}
        </button>
    );
};

export default Button;
