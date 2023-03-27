import React from "react";

const Button = ({ handleClick, className, text, disabled = false }) => {
    return (
        <button
            onClick={(e) => handleClick(e.target.value)}
            className={
                "w-full border-2 border-primary px-12 py-2 font-semibold bg-white " +
                "text-primary hover:text-primary hover:border-primary cursor-pointer " +
                "rounded-md mb-4 " +
                className
            }
            disabled={disabled}
        >
            {text}
        </button>
    );
};

export default Button;
