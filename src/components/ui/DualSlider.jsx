import * as React from "react";
import { Range, getTrackBackground } from "react-range";

const DualSlider = ({ min, max, step, values, handle_change, indicator }) => {
    return (
        <div
            style={{
                display: "flex",
                justifyContent: "center",
                flexWrap: "wrap",
            }}
        >
            <Range
                values={values}
                step={step}
                min={min}
                max={max}
                onChange={(values) => handle_change(values)}
                renderTrack={({ props, children }) => (
                    <div
                        onMouseDown={props.onMouseDown}
                        onTouchStart={props.onTouchStart}
                        style={{
                            ...props.style,
                            height: "28px",
                            display: "flex",
                            width: "80%",
                        }}
                    >
                        <div
                            ref={props.ref}
                            style={{
                                height: "5px",
                                width: "100%",
                                borderRadius: "4px",
                                background: getTrackBackground({
                                    values: values,
                                    colors: ["#ccc", "#548BF4", "#ccc"],
                                    min: min,
                                    max: max,
                                }),
                                alignSelf: "center",
                            }}
                        >
                            {children}
                        </div>
                    </div>
                )}
                renderThumb={({ props, isDragged }) => (
                    <div
                        {...props}
                        style={{
                            ...props.style,
                            height: "20px",
                            width: "20px",
                            borderRadius: "4px",
                            backgroundColor: "#FFF",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            boxShadow: "0px 2px 6px #AAA",
                        }}
                    >
                        <div
                            style={{
                                height: "16px",
                                width: "5px",
                                backgroundColor: isDragged ? "#548BF4" : "#CCC",
                            }}
                        />
                    </div>
                )}
            />
            <output className="mt-4 mb-4 text-white" id="output">
                {values[0] + " " + indicator} - {values[1] + " " + indicator}
            </output>
        </div>
    );
};

export default DualSlider;
