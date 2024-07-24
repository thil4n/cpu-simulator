import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

interface InputProps {
    name: string;
    value: string;
    error?: string | null;
    label?: string;
    required?: boolean;
    min?: number;
    max?: number | null;
    placeholder?: string;
    type?: string;
    icon?: React.ReactNode;
    readOnly?: boolean;
    disabled?: boolean;
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    inputClassName?: string;
    labelClassName?: string;
}

const Input: React.FC<InputProps> = ({
    name,
    value,
    error = null,
    label = "",
    required = false,
    min = 0,
    max = null,
    placeholder = "",
    type = "text",
    icon = null,
    readOnly = false,
    disabled = false,
    handleChange,
    inputClassName = "",
    labelClassName = "",
}) => {
    const [showPassword, setShowPassword] = useState(false);

    const inputClasses = (): string => {
        let classes =
            "w-full bg-primary text-secondary " +
            "appearance-none transition duration-300 " +
            "ease-in-out focus:outline-none " +
            "focus:ring-0 border mb-2 " +
            "border-border-base rounded-md border-slate-500 h-12 ";

        classes += icon ? "px-10  " : "px-4 ";
        classes += inputClassName;

        return classes;
    };

    const labelClasses = (): string => {
        let classes = "mb-2 flex ";
        classes += labelClassName;
        return classes;
    };

    return (
        <div className="w-full flex flex-col mb-1">
            {label.length !== 0 && (
                <label className={labelClasses()}>
                    {label}
                    {required && <span className="text-red-500 ml-2">*</span>}
                </label>
            )}

            <div className="relative">
                {icon && (
                    <div className="absolute left-3 top-4 text-gray-500">
                        {icon}
                    </div>
                )}
                <input
                    name={name}
                    type={showPassword ? "text" : type}
                    className={inputClasses()}
                    placeholder={placeholder}
                    value={value}
                    min={min}
                    max={max !== null ? max : undefined}
                    readOnly={readOnly}
                    disabled={disabled}
                    onChange={(e) => {
                        handleChange(name, e.target.value);
                    }}
                />
                {type === "password" && (
                    <span
                        className="absolute text-gray-800 right-3 top-4 cursor-pointer"
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </span>
                )}
            </div>
            {error && <p className="text-red-500 block">{error}</p>}
        </div>
    );
};

export default Input;
