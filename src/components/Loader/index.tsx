import { CpuIcon } from "lucide-react";
import { useState, useEffect } from "react";

const Loader = ({ handleClose }) => {
    const [percentage, setPercentage] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            if (percentage < 100) {
                setPercentage((prevProgress) => prevProgress + 2);
            } else {
                handleClose();
            }
        }, 50);

        return () => clearInterval(interval);
    }, [percentage]);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex justify-center items-center z-50">
            <div className="flex flex-col items-center w-2/3 max-w-md space-y-4">
                <CpuIcon
                    size={72}
                    className="text-primary animate-cpu-spin mb-6"
                />
                <div className="w-full bg-slate-300 rounded-sm">
                    <div
                        className="bg-primary py-1 transition-all duration-200"
                        style={{ width: `${percentage}%` }}
                    ></div>
                </div>
                <p className="text-center text-slate-300 mt-1">
                    {"Initiating " + percentage + "%"}
                </p>
            </div>
        </div>
    );
};

export default Loader;
