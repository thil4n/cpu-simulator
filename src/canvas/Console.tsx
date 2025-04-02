import { useEffect, useRef } from "react";

const Console = ({ logs }: { logs: { type: string; message: string }[] }) => {
    const consoleRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (consoleRef.current) {
            consoleRef.current.scrollTop = consoleRef.current.scrollHeight;
        }
    }, [logs]);

    return (
        <div
            ref={consoleRef}
            className="w-full text-sm font-mono bg-gradient-to-b from-gray-800 to-gray-900 
                 text-gray-200 rounded-lg p-4 h-40 overflow-y-auto border border-gray-700 shadow-lg"
        >
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
                            {log.type === "error" ? "[ERROR]" : "[INFO]"}
                        </span>{" "}
                        {log.message}
                    </p>
                ))
            )}
        </div>
    );
};

export default Console;
