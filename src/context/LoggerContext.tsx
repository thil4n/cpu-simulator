import { createContext, useContext, useState, ReactNode } from "react";

interface Log {
    type: "info" | "error";
    message: string;
}

interface LoggerContextType {
    logs: Log[];
    info: (message: string) => void;
    error: (message: string) => void;
    clear: () => void;
}

const LoggerContext = createContext<LoggerContextType | undefined>(undefined);

export const LoggerProvider = ({ children }: { children: ReactNode }) => {
    const [logs, setLogs] = useState<Log[]>([]);

    const info = (message: string) => {
        setLogs((prevLogs) => [...prevLogs, { type: "info", message }]);
    };

    const error = (message: string) => {
        setLogs((prevLogs) => [...prevLogs, { type: "error", message }]);
    };

    const clear = () => {
        setLogs([]);
    };

    return (
        <LoggerContext.Provider value={{ logs, info, error, clear }}>
            {children}
        </LoggerContext.Provider>
    );
};

export const useLoggerContext = () => {
    const context = useContext(LoggerContext);
    if (!context) {
        throw new Error(
            "useLoggerContext must be used within a LoggerProvider"
        );
    }
    return context;
};
