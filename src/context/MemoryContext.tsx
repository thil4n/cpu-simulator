import { createContext, useContext, useState, ReactNode } from "react";

interface Memory {
    [address: string]: number; // each address holds a single byte (0–255)
}

interface MemoryContextType {
    memory: Memory;
    setMemoryByte: (address: number, byte: number) => void;
    setMemoryBytes: (address: number, bytes: number[]) => void;
    getMemoryByte: (address: number) => number;
    getMemoryBytes: (address: number, length: number) => number[];
    clearMemory: () => void;
}

const MemoryContext = createContext<MemoryContextType | undefined>(undefined);

export const MemoryProvider = ({ children }: { children: ReactNode }) => {
    const [memory, setMemory] = useState<Memory>({});

    const setMemoryByte = (address: number, byte: number) => {
        setMemory((prev) => ({
            ...prev,
            [address.toString(16).padStart(4, "0")]: byte & 0xff,
        }));
    };

    const setMemoryBytes = (address: number, bytes: number[]) => {
        setMemory((prev) => {
            const updated = { ...prev };
            bytes.forEach((byte, i) => {
                const addr = (address + i).toString(16).padStart(4, "0");
                updated[addr] = byte & 0xff;
            });
            return updated;
        });
    };

    const getMemoryByte = (address: number): number => {
        const addr = address.toString(16).padStart(4, "0");
        return memory[addr] ?? 0;
    };

    const getMemoryBytes = (address: number, length: number): number[] => {
        return Array.from({ length }, (_, i) => getMemoryByte(address + i));
    };

    const clearMemory = () => {
        setMemory({});
    };

    return (
        <MemoryContext.Provider
            value={{
                memory,
                setMemoryByte,
                setMemoryBytes,
                getMemoryByte,
                getMemoryBytes,
                clearMemory,
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
