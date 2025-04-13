import { useLoggerContext } from "@context";
import { useEffect, useRef } from "react";

const Console = () => {
    const consoleRef = useRef<HTMLDivElement>(null);
    const { logs, clear } = useLoggerContext();

    useEffect(() => {
        if (consoleRef.current) {
            consoleRef.current.scrollTop = consoleRef.current.scrollHeight;
        }
    }, [logs]);

    return (
        <div className="w-full">
            <div
                ref={consoleRef}
                className="w-full text-sm font-mono bg-gradient-to-b from-gray-800 to-gray-900 
                   text-gray-200 rounded-lg h-40 overflow-y-auto border border-gray-700 shadow-lg "
            >
                <button
                    onClick={clear}
                    className="absolute top-2 right-4 text-xs bg-primary hover:bg-secondary text-white px-2 py-1 rounded"
                >
                    Clear
                </button>
                <div className="p-4">
                    {" "}
                    {logs.length === 0 ? (
                        <p className="text-gray-500">No logs yet...</p>
                    ) : (
                        logs.map((log, index) => (
                            <p
                                key={index}
                                className={`mb-1 ${
                                    log.type === "error"
                                        ? "text-red-400"
                                        : "text-green-400"
                                }`}
                            >
                                <span className="font-bold">
                                    {log.type === "error"
                                        ? "[ERROR]"
                                        : "[INFO]"}
                                </span>{" "}
                                {log.message}
                            </p>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default Console;
