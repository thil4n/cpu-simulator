import React, { Component } from "react";

export default class MinMax extends Component {
    get_classess(parameter) {
        let classes =
            "bg-white px-4 " +
            "appearance-none transition duration-300 " +
            "ease-in-out focus: outline-none " +
            "focus:ring-0 border mb-2 " +
            "border-border-base rounded-md focus:border-green-500 h-12";

        classes +=
            parameter == "min" && !this.props.input.is_min_valid
                ? " border-red-500"
                : "";
        classes +=
            parameter == "max" && !this.props.input.is_max_valid
                ? " border-red-500"
                : "";

        return classes;
    }

    render() {
        return (
            <div className="w-full flex flex-col mb-1">
                <label className="mb-2">{this.props.input.text}</label>
                <div className="grid grid-cols-2 gap-2">
                    <input
                        ref="input"
                        type="number"
                        name={this.props.input.key}
                        className={this.get_classess("min")}
                        placeholder="Min"
                        value={this.props.input.value.min}
                        onChange={(event) =>
                            this.props.handle_change(
                                event,
                                this.props.input,
                                "min"
                            )
                        }
                    ></input>

                    <input
                        ref="input"
                        type="number"
                        name={this.props.input.key}
                        className={this.get_classess("max")}
                        placeholder="Max"
                        value={this.props.input.value.max}
                        onChange={(event) =>
                            this.props.handle_change(
                                event,
                                this.props.input,
                                "max"
                            )
                        }
                    ></input>
                </div>
                <p
                    className={
                        this.props.is_max_valid == true
                            ? "hidden"
                            : "text-red-500 text-sm block"
                    }
                >
                    {this.props.input.min_error}
                </p>
                <p
                    className={
                        this.props.is_max_valid == true
                            ? "hidden"
                            : "text-red-500 text-sm block"
                    }
                >
                    {this.props.input.max_error}
                </p>
            </div>
        );
    }
}
