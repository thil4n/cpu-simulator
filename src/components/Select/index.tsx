import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import { HiOutlineChevronDown, HiOutlineX } from "react-icons/hi";

interface Option {
    id: string;
    title: string;
}

interface SelectProps {
    name: string;
    value: string;
    initValue?: Option | null;
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
    handleChange: (name: string, value: string | null) => void;
    inputClassName?: string;
    labelClassName?: string;
    optList?: Option[];
}

const Select: React.FC<SelectProps> = ({
    name,
    value,
    initValue = null,
    error = null,
    label = "",
    required = false,
    placeholder = "",
    readOnly = false,
    disabled = false,
    handleChange,
    inputClassName = "",
    labelClassName = "",
    optList = [],
}) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [changed, setChanged] = useState(false);
    const [placeHolderStr, setPlaceHolderStr] = useState(
        placeholder || "Search an item"
    );
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const filteredOptions = optList.filter((item: Option) =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const inputClasses = () => {
        let classes =
            "w-full px-4 " +
            "appearance-none transition duration-300 " +
            "ease-in-out focus:outline-none " +
            "focus:ring-0 border mb-2 " +
            "border-border-base rounded-md focus:border-green-500 h-12 relative";

        classes += error ? " border-red-500" : "";
        classes += value
            ? " placeholder-slate-600 "
            : " placeholder-slate-400 ";
        classes += inputClassName;

        return classes;
    };

    const handleOutsideClick = (event: MouseEvent) => {
        if (
            dropdownRef.current &&
            !dropdownRef.current.contains(event.target as Node)
        ) {
            setDropdownOpen(false);
        }
    };

    useEffect(() => {
        if (initValue && value !== initValue.id && !changed) {
            handleChange(name, initValue.id);
            setPlaceHolderStr(initValue.title);
        } else if (value && !initValue) {
            const selectedItem = optList.find((item) => item.id === value);
            if (selectedItem && placeHolderStr !== selectedItem.title) {
                setPlaceHolderStr(selectedItem.title);
            }
        }
        // Add the event listener
        document.addEventListener("click", handleOutsideClick);

        // Clean up the event listener
        return () => {
            document.removeEventListener("click", handleOutsideClick);
        };
    }, [initValue, value, name, handleChange, optList]);

    return (
        <div className="w-full flex flex-col mb-1 relative">
            {label && (
                <label className={`mb-2 ${labelClassName}`}>
                    {label}
                    {required && <span className="text-red-500 ml-2">*</span>}
                </label>
            )}

            <div className="relative inline-block w-full" ref={dropdownRef}>
                <input
                    type="text"
                    className={inputClasses()}
                    placeholder={placeHolderStr}
                    value={searchTerm}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                        setSearchTerm(e.target.value);
                        setDropdownOpen(true);
                    }}
                    onFocus={() => setDropdownOpen(true)}
                    readOnly={readOnly}
                    disabled={disabled}
                />

                {(value || searchTerm) && (
                    <span
                        className="absolute text-gray-800 right-10 top-4 cursor-pointer"
                        onClick={() => {
                            setSearchTerm("");
                            setPlaceHolderStr(placeholder || "Search an item");
                            handleChange(name, null);
                        }}
                    >
                        <HiOutlineX />
                    </span>
                )}

                <span className="absolute text-gray-800 right-3 top-4 cursor-pointer">
                    <HiOutlineChevronDown />
                </span>

                {isDropdownOpen && filteredOptions.length > 0 && (
                    <div className="w-full flex flex-col max-h-48 overflow-y-auto absolute bg-white border z-10">
                        {filteredOptions.map((item: Option) => (
                            <span
                                className="px-3 py-3 hover:bg-slate-100  transition smooth border-b-[1px] border-slate-200 cursor-pointer w-full"
                                onClick={() => {
                                    setChanged(true);
                                    handleChange(name, item.id);
                                    setPlaceHolderStr(item.title);
                                    setSearchTerm("");
                                    setDropdownOpen(false);
                                }}
                                key={item.id}
                            >
                                {item.title}
                            </span>
                        ))}
                    </div>
                )}
            </div>

            {error && <p className="text-red-500 block">{error}</p>}
        </div>
    );
};

export default Select;