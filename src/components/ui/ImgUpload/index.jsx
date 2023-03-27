import React, { useRef, useState } from "react";
import { toast } from "react-toastify";

import Thumbnail from "./thumbnail";

const Image = ({ input, handleChange, labelClassName }) => {
    const fileUpload = useRef(null);
    const dropRef = useRef(null);
    const [allowUpload, setUllowUpload] = useState(true);

    const getDivClassList = () => {
        let classList =
            "border-dashed border-2 border-border-base h-36 rounded flex " +
            "flex-col justify-center items-center cursor-pointer " +
            "focus: border-accent-400 focus:outline-none ";
        //if (input.data.length === input.max) classList += "hidden";
        return classList;
    };

    const showFileUpload = () => {
        if (!input.multiple && input.data.length) {
            toast.error("You can upload only one image");

            return;
        }
        if (input.data.length === input.max) {
            toast.error("Maximum image count is " + input.max);

            return;
        }
        fileUpload.current.click();
    };

    const handleDrop = (event) => {
        event.preventDefault();

        const [file] = event.dataTransfer.files;
        if (file.type.startsWith("image/")) {
            const reader = new FileReader();

            reader.onload = (event) => {
                const images = input.data;
                const key = images.length;
                const obj = { key: key, data: file };
                images.push(obj);

                handleChange(images, input);
            };

            reader.readAsDataURL(file);
        } else {
            toast.error("Please select a valid file type!");
        }
    };

    const handleDrag = (event) => {
        event.preventDefault();
    };

    const change = (e) => {
        if (!e.target.files[0]) return;

        if (!e.target.files[0].type.startsWith("image")) {
            toast.error("Please select a valid file type!");

            return;
        }

        const images = input.data;
        const key = images.length;
        const obj = { key: key, data: e.target.files[0] };
        images.push(obj);

        handleChange(images, input);
    };

    const handleDeleteImg = (deleteImg) => {
        const images = input.data.filter((img) => img !== deleteImg);

        handleChange(images, input);
    };

    const getLabelClassList = () => {
        let classes = "mb-2 ";
        classes += 0 ? "text-white " : " ";
        classes += labelClassName;
        return classes;
    };

    return (
        <div className="w-full mb-5">
            {input.label.length != 0 && (
                <label className={getLabelClassList()}>{input.label}</label>
            )}

            <div
                className="mt-2 p-5 md:p-8 bg-light shadow rounded "
                ref={dropRef}
                onDrop={handleDrop}
                onDragOver={handleDrag}
            >
                <section className="upload">
                    <div
                        tabIndex={0}
                        className={getDivClassList()}
                        onClick={showFileUpload}
                    >
                        <input
                            accept="image/*"
                            type="file"
                            autoComplete="off"
                            tabIndex={-1}
                            className="hidden"
                            ref={fileUpload}
                            defaultValue=""
                            onChange={change}
                        />

                        <p className="text-body text-sm mt-4 text-center">
                            <span className="text-accent font-semibold mr-2">
                                Upload an image
                            </span>
                            or drag and drop <br />
                            <span className="text-xs text-body">PNG, JPG</span>
                        </p>
                    </div>
                    <div className="flex">
                        {input.data.map((img) => (
                            <Thumbnail
                                key={img.key}
                                img={img}
                                handleDelete={handleDeleteImg}
                            />
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Image;
