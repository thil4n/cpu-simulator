import { CpuIcon } from "lucide-react";
import { useState, useEffect, useCallback } from "react";

interface LoaderProps {
    handleClose: () => void;
}

const Loader = ({ handleClose }: LoaderProps) => {
    const [percentage, setPercentage] = useState(0);

    const stableHandleClose = useCallback(handleClose, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setPercentage((prev) => {
                if (prev >= 100) {
                    clearInterval(interval);
                    return prev;
                }
                return prev + 2;
            });
        }, 50);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (percentage >= 100) {
            stableHandleClose();
        }
    }, [percentage, stableHandleClose]);

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
