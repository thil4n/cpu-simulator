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

    const MAX_LOGS = 500;

    const info = (message: string) => {
        setLogs((prevLogs) => {
            const newLogs = [...prevLogs, { type: "info" as const, message }];
            return newLogs.length > MAX_LOGS ? newLogs.slice(-MAX_LOGS) : newLogs;
        });
    };

    const error = (message: string) => {
        setLogs((prevLogs) => {
            const newLogs = [...prevLogs, { type: "error" as const, message }];
            return newLogs.length > MAX_LOGS ? newLogs.slice(-MAX_LOGS) : newLogs;
        });
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
