import React, { useEffect, useRef, useState } from "react";
import { HiOutlineChevronDown } from "react-icons/hi";

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
  placeholder?: string;
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
  placeholder = "Select an item",
  readOnly = false,
  disabled = false,
  handleChange,
  inputClassName = "",
  labelClassName = "",
  optList = [],
}) => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [selectedValue, setSelectedValue] = useState<string>(placeholder);

  useEffect(() => {
    if (initValue && value !== initValue.id) {
      handleChange(name, initValue.id);
      setSelectedValue(initValue.title);
    } else if (value) {
      const selectedItem = optList.find((item) => item.id === value);
      if (selectedItem) {
        setSelectedValue(selectedItem.title);
      }
    }
  }, [initValue, value, name, handleChange, optList]);

  const handleOutsideClick = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleOutsideClick);
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  return (
    <div className="w-full flex flex-col mb-1 relative">
      {label && (
        <label className={`mb-1 flex ${labelClassName}`}>
          {label}
          {required && <span className="text-red-500 ml-2">*</span>}
        </label>
      )}

      <div className="relative inline-block w-full" ref={dropdownRef}>
        <div
          className={`w-full bg-primary text-secondary px-4 border border-slate-500 h-10 flex items-center justify-between cursor-pointer rounded-md ${
            error ? "border-red-500" : ""
          } ${inputClassName}`}
          onClick={() =>
            !readOnly && !disabled && setDropdownOpen(!isDropdownOpen)
          }
        >
          <span>{selectedValue}</span>
          <HiOutlineChevronDown />
        </div>

        {isDropdownOpen && (
          <div className="w-full flex flex-col max-h-48 overflow-y-auto absolute bg-white border z-10">
            {optList.map((item: Option) => (
              <span
                className="px-3 py-3 hover:bg-slate-100 transition smooth border-b border-slate-200 cursor-pointer w-full"
                onClick={() => {
                  handleChange(name, item.id);
                  setSelectedValue(item.title);
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
