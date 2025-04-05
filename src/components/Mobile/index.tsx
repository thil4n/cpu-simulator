import { CpuIcon } from "lucide-react";

const Mobile = () => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex justify-center items-center z-50">
            <div className="flex flex-col items-center w-2/3 max-w-md space-y-4">
                <CpuIcon
                    size={72}
                    className="text-primary animate-cpu-spin mb-6"
                />
                <p className="text-center text-slate-300 mt-1">
                    This application is only supported on desktop devices.
                    <br /> Please use a larger screen to continue.
                </p>
            </div>
        </div>
    );
};

export default Mobile;
