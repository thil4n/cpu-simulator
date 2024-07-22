import React, { useState, useEffect, useRef, ChangeEvent } from "react";
import { HiOutlineX, HiOutlineChevronDown } from "react-icons/hi";

interface Attribute {
    _id?: string | null;
    title: string;
    type: string;
    options?: Option[] | string[];
}

interface Option {
    id: string;
    title: string;
}

interface FormField {
    id: string;
    icon?: unknown;
    required: boolean;
    label: string;
    data: number | string | string[] | object[] | null;
    type: string;
    error: string | null;
    optList?: { id: string; title: string }[];
    optTitle?: string;
    cols?: number;
    rows?: number;
    multiple?: boolean;
    min?: number;
    max?: number;
    placeHolderStr?: string;
}

interface SelectProps {
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
    handleChange: () => void;
    inputClassName?: string;
    labelClassName?: string;
}

const Select: React.FC<SelectProps> = ({
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
    optList = [],
}) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [placeHolderStr, setPlaceHolderStr] = useState(
        placeholder ? placeholder : "Search an item"
    );
    const [isDropdownOpen, setDropdownOpen] = useState(false);

    const dropdownRef = useRef(null);

    const filteredOptions = optList
        ? optList.filter((item) =>
              item.title.toLowerCase().includes(searchTerm.toLowerCase())
          )
        : [];

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
        if (value) {
            const selectedItem = optList.find((item) => {
                return value === item.id;
            });
            setPlaceHolderStr(selectedItem.title);
        }
        document.addEventListener("click", handleOutsideClick);

        return () => {
            document.removeEventListener("click", handleOutsideClick);
        };
    }, []);

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
                />

                {(value || searchTerm.length !== 0) && (
                    <span
                        className="absolute text-gray-800 right-10 top-4 cursor-pointer"
                        onClick={() => {
                            setSearchTerm("");
                            setPlaceHolderStr(
                                placeHolderStr || "Search an item"
                            );
                            handleChange(name, null);
                        }}
                    >
                        <HiOutlineX />
                    </span>
                )}

                <span className="absolute text-gray-800 right-3 top-4 cursor-pointer">
                    <HiOutlineChevronDown />
                </span>

                {isDropdownOpen && (
                    <div className="w-full flex flex-col max-h-48 overflow-y-auto absolute bg-white border z-10">
                        {filteredOptions.map((item: Option) => (
                            <span
                                className="px-3 py-3 hover:bg-slate-100  transition smooth border-b-[1px] border-slate-200  cursor-pointer w-full"
                                onClick={() => {
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
