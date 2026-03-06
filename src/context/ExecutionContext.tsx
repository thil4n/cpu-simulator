import { createContext, useContext, useState, useCallback, ReactNode, useRef } from "react";

interface Snapshot {
    registers: { [key: string]: number[] };
    memory: { [address: string]: number };
}

interface ExecutionContextType {
    /** Breakpoints: set of instruction addresses */
    breakpoints: Set<number>;
    toggleBreakpoint: (address: number) => void;
    hasBreakpoint: (address: number) => boolean;
    clearBreakpoints: () => void;

    /** History: stack of state snapshots for step-back */
    pushSnapshot: (snapshot: Snapshot) => void;
    popSnapshot: () => Snapshot | undefined;
    canStepBack: boolean;
    historySize: number;
    clearHistory: () => void;

    /** Running state (run-until-breakpoint mode) */
    isRunning: boolean;
    setRunning: (val: boolean) => void;
}

const ExecutionContext = createContext<ExecutionContextType | undefined>(undefined);

const MAX_HISTORY = 500;

export const ExecutionProvider = ({ children }: { children: ReactNode }) => {
    const [breakpoints, setBreakpoints] = useState<Set<number>>(new Set());
    const historyRef = useRef<Snapshot[]>([]);
    const [historySize, setHistorySize] = useState(0);
    const [isRunning, setRunning] = useState(false);

    const toggleBreakpoint = useCallback((address: number) => {
        setBreakpoints((prev) => {
            const next = new Set(prev);
            if (next.has(address)) {
                next.delete(address);
            } else {
                next.add(address);
            }
            return next;
        });
    }, []);

    const hasBreakpoint = useCallback(
        (address: number) => breakpoints.has(address),
        [breakpoints]
    );

    const clearBreakpoints = useCallback(() => {
        setBreakpoints(new Set());
    }, []);

    const pushSnapshot = useCallback((snapshot: Snapshot) => {
        historyRef.current.push(snapshot);
        if (historyRef.current.length > MAX_HISTORY) {
            historyRef.current.shift();
        }
        setHistorySize(historyRef.current.length);
    }, []);

    const popSnapshot = useCallback((): Snapshot | undefined => {
        const snapshot = historyRef.current.pop();
        setHistorySize(historyRef.current.length);
        return snapshot;
    }, []);

    const clearHistory = useCallback(() => {
        historyRef.current = [];
        setHistorySize(0);
    }, []);

    return (
        <ExecutionContext.Provider
            value={{
                breakpoints,
                toggleBreakpoint,
                hasBreakpoint,
                clearBreakpoints,
                pushSnapshot,
                popSnapshot,
                canStepBack: historySize > 0,
                historySize,
                clearHistory,
                isRunning,
                setRunning,
            }}
        >
            {children}
        </ExecutionContext.Provider>
    );
};

export const useExecutionContext = () => {
    const context = useContext(ExecutionContext);
    if (!context) {
        throw new Error(
            "useExecutionContext must be used within an ExecutionProvider"
        );
    }
    return context;
};
