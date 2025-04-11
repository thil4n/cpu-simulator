import React, { useState } from "react";

interface InputProps {
  name: string;
  rows: number;
  value: string;
  error?: string | null;
  label?: string;
  required?: boolean;
  placeholder?: string;
  readOnly?: boolean;
  disabled?: boolean;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  inputClassName?: string;
  labelClassName?: string;
}

const Input: React.FC<InputProps> = ({
  name,
  rows = 10,
  value,
  error = null,
  label = "",
  required = false,
  placeholder = "",
  readOnly = false,
  disabled = false,
  handleChange,
  inputClassName = "",
  labelClassName = "",
}) => {
  const inputClasses = (): string => {
    let classes =
      "w-full bg-primary " +
      "appearance-none transition duration-300 " +
      "ease-in-out focus:outline-none " +
      "focus:ring-0 border mb-2 " +
      "border-border-base rounded-md focus:border-green-500 ";

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
        <textarea
          rows={rows}
          name={name}
          className={inputClasses()}
          placeholder={placeholder}
          value={value}
          readOnly={readOnly}
          disabled={disabled}
          onChange={(e) => {
            handleChange(name, e.target.value);
          }}
        />
      </div>
      {error && <p className="text-red-500 block">{error}</p>}
    </div>
  );
};

export default Input;
