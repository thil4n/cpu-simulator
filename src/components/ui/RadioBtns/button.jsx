import React from "react";

const Button = ({ selected_value, item, handle_click }) => {
    const get_classes = () => {
        let classes = `border-2 
                            px-6 py-2 font-semibold bg-transparent_bg
                           hover:text-primary hover:border-primary
                          cursor-pointer rounded-md mb-4
                          `;

        classes +=
            selected_value == item.id
                ? " text-primary border-primary"
                : " text-white border-[#cccccc]";

        return classes;
    };
    return (
        <button onClick={() => handle_click(item.id)} className={get_classes()}>
            {item.text}
        </button>
    );
};
export default Button;
