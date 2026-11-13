import { useMemoryContext, useRegisterContext, useExecutionContext } from "@context";
import { bitArrayToNumber, parseSingleLine } from "@utils";
import { disassemble } from "@lib";
import { Cpu } from "lucide-react";
import { TXT_START } from "@config";
import { useMemo } from "react";

interface instructionLine {
    instruction: string;
    address: number;
    isCurrent: boolean;
}

const InstructionView = () => {
    const { getMemoryBytes } = useMemoryContext();
    const { registers } = useRegisterContext();
    const { breakpoints, toggleBreakpoint } = useExecutionContext();

    const rip = bitArrayToNumber(registers.rip);

    const instructions = useMemo(() => {
        let tempPtr = TXT_START;
        const result: instructionLine[] = [];

        let fetch = true;
        while (fetch) {
            const opcodes = getMemoryBytes(tempPtr, 10);

            try {
                const { instruction, length } = disassemble(opcodes);
                result.push({ instruction, address: tempPtr, isCurrent: tempPtr === rip });
                tempPtr += length;
            } catch (error) {
                fetch = false;
            }
        }

        return result;
    }, [getMemoryBytes, rip]);

    return (
        <div>
            <h1 className="bg-primary text-secondary w-full py-1 text-sm text-center uppercase">
                ASSEMBLY INSTRUCTIONS
            </h1>
            <div className="bg-[#555] bg-opacity-50 backdrop-blur-lg px-6 py-4 min-h-[400px]">
                {instructions.map((line: instructionLine, index: number) => {
                    const { operation, operandOne, operandTwo } =
                        parseSingleLine(line.instruction);
                    const hasBP = breakpoints.has(line.address);
                    return (
                        <div
                            key={index}
                            className={`flex items-center py-1 px-2 border-b border-secondary cursor-pointer group
                ${
                    line.isCurrent
                        ? "bg-secondary text-white"
                        : "hover:bg-primary text-slate-400 hover:text-secondary"
                }
            `}
                        >
                            {/* Breakpoint gutter */}
                            <div
                                className="w-5 h-5 flex items-center justify-center mr-2 shrink-0"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    toggleBreakpoint(line.address);
                                }}
                                title={hasBP ? "Remove breakpoint" : "Set breakpoint"}
                            >
                                {hasBP ? (
                                    <span className="w-3 h-3 rounded-full bg-red-500 inline-block shadow-[0_0_6px_rgba(239,68,68,0.7)]" />
                                ) : (
                                    <span className="w-3 h-3 rounded-full border border-slate-600 inline-block opacity-0 group-hover:opacity-50 transition-opacity" />
                                )}
                            </div>
                            <div className="w-32">{operation}</div>
                            <div className="w-[300px]">{operandOne}</div>
                            <div className="">{operandTwo}</div>
                        </div>
                    );
                })}
                {instructions.length == 0 && (
                    <div className="w-full flex flex-col justify-center items-center">
                        <Cpu
                            size={64}
                            className="text-7xl text-secondary mb-4 animate-cpu-spin"
                        />
                        <h1 className="text-secondary text-md">
                            No instructions loaded. Click on Load Program to
                            load instructions.
                        </h1>
                    </div>
                )}
            </div>
        </div>
    );
};

export default InstructionView;
