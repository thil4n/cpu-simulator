import React from "react";
import Button from "./button";

const RadioBtns = ({ radio_btns, handle_click }) => {
    return (
        <div className="flex gap-3">
            {radio_btns.item_list.map((item, index) => (
                <Button
                    key={index}
                    selected_value={radio_btns.value}
                    handle_click={handle_click}
                    item={item}
                />
            ))}
        </div>
    );
};

export default RadioBtns;
