import React, { useState, useEffect } from "react";

const Thumbnail = ({ img, handleDelete }) => {
    const [src, setSrc] = useState(null);

    useEffect(() => {
        if (typeof img.data == "string") {
            setSrc(img.data);
        } else {
            let reader = new FileReader();
            reader.onload = (e) => {
                setSrc(e.target.result);
            };
            reader.readAsDataURL(img.data);
        }
    }, []);

    return (
        <aside className="flex flex-wrap mt-2 mr-2">
            <a
                href="#"
                className="pointer absolute z-40 mt-2 ml-12 rounded-full 
                    bg-emerald-700 w-4 h-4 p-0 m-0 text-white font-mono 
                    text-sm  leading-tight text-center"
                onClick={() => handleDelete(img)}
            >
                x
            </a>
            <div className="inline-flex flex-col overflow-hidden border border-border-200 rounded mt-2 me-2 relative">
                <div className="flex items-center justify-center min-w-0 w-16 h-16 overflow-hidden">
                    <img src={src} />
                </div>
            </div>
        </aside>
    );
};

export default Thumbnail;
