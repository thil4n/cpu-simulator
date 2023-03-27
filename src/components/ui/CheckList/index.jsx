import React from "react";
import CheckBox from "./check-box";

function CheckList({ list, handle_check, dark_mode }) {
    return (
        <div>
            {list.text}
            {list.opt_list.map((item, index) => (
                <CheckBox
                    key={index}
                    list_id={list.key}
                    item={item}
                    handle_check={handle_check}
                    dark_mode={dark_mode}
                />
            ))}
        </div>
    );
}

export default CheckList;
