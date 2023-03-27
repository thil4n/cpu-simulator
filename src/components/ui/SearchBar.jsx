import React from "react";

const SearchBar = ({ mode, value, handle_change }) => {
    const get_classess = () => {
        let classes =
            "px-4 " +
            "appearance-none transition duration-300 " +
            "ease-in-out focus: outline-none " +
            "focus:ring-0 border mb-2 " +
            "border-border-base rounded-md focus:border-green-500 h-12 w-full mr-4";

        classes += mode == "dark" ? " bg-black text-white" : " bg-white";

        return classes;
    };

    return (
        <div className="w-full flex flex-col mb-1">
            <div className="flex">
                <input
                    type="text"
                    className={get_classess()}
                    placeholder={"Search"}
                    value={value}
                    onChange={(event) => handle_change(event)}
                ></input>
            </div>
        </div>
    );
};

export default SearchBar;
