const TextArea = ({ name, value, handleChange, rows }) => {
    const getClasses = () => {
        let classes =
            "w-full bg-primary text-secondary " +
            "appearance-none transition duration-300 " +
            "ease-in-out focus:outline-none " +
            "focus:ring-0 border mb-2 " +
            "border-border-base rounded-md border-slate-500";

        return classes;
    };

    return (
        <div className="w-full flex flex-col mb-1">
            <textarea
                className={getClasses()}
                rows={rows}
                value={value}
                onChange={(event) => handleChange(name, event.target.value)}
            ></textarea>
        </div>
    );
};

export default TextArea;
