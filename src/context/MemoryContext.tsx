import { createContext, useContext, useState, ReactNode } from "react";

interface Memory {
    [key: number]: number;
}

interface MemoryContextType {
    memory: Memory;
    memset: (key: number, value: number) => void;
}

const MemoryContext = createContext<MemoryContextType | undefined>(undefined);

export const MemoryProvider = ({ children }: { children: ReactNode }) => {
    const [memory, setMemory] = useState<Memory>({});

    const memset = (key: number, value: number) => {
        setMemory((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    return (
        <MemoryContext.Provider
            value={{
                memory,
                memset,
            }}
        >
            {children}
        </MemoryContext.Provider>
    );
};

export const useMemoryContext = () => {
    const context = useContext(MemoryContext);
    if (!context) {
        throw new Error(
            "useMemoryContext must be used within a MemoryProvider"
        );
    }
    return context;
};
