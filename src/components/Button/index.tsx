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
            className={`border-2 px-12 py-2 font-semibold bg-secondary text-white
                        hover:bg-primary cursor-pointer
                        rounded-md mb-2 ${className}`}
            disabled={disabled || loading}
        >
            {loading ? <div className="loader"></div> : text}
        </button>
    );
};

export default Button;
