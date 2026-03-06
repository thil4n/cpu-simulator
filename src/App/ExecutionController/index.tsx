import {
    useLoggerContext,
    useMemoryContext,
    useRegisterContext,
    useExecutionContext,
} from "@context";
import { bitArrayToNumber, numberToBitArray, parseSingleLine } from "@utils";
import { disassemble } from "@lib";

import { Button, Modal } from "@components";

import useInstructions from "../../instructions/useInstructions";
import { useModal } from "@hooks";
import { useRef, useCallback, useEffect } from "react";
import CustomInstruction from "./CustomInstruction";

const JUMP_OPS = new Set(["jmp", "je", "jz", "jne", "jnz", "jg", "jl"]);
const MAX_RUN_STEPS = 10000; // safety limit to prevent infinite loops

const ExecutionController = () => {
    const { memory, getMemoryBytes, restoreMemory } = useMemoryContext();
    const { registers, regset, restoreRegisters } = useRegisterContext();
    const logger = useLoggerContext();
    const {
        breakpoints,
        pushSnapshot,
        popSnapshot,
        canStepBack,
        historySize,
        isRunning,
        setRunning,
    } = useExecutionContext();

    const {
        push, pop, mov, add, sub, cmp,
        and, or, xor, not,
        shl, shr,
        inc, dec, neg,
        mul, imul, div,
        test, xchg, lea,
    } = useInstructions();

    const { modalStatus, openModal, closeModal } = useModal();

    // Refs for run-loop so we read latest state
    const registersRef = useRef(registers);
    const memoryRef = useRef(memory);
    registersRef.current = registers;
    memoryRef.current = memory;

    const captureSnapshot = useCallback(() => {
        // Deep-copy registers (each value is an array)
        const regSnap: { [key: string]: number[] } = {};
        for (const key of Object.keys(registersRef.current)) {
            regSnap[key] = [...registersRef.current[key]];
        }
        // Shallow-copy memory (values are primitives)
        const memSnap = { ...memoryRef.current };
        pushSnapshot({ registers: regSnap, memory: memSnap });
    }, [pushSnapshot]);

    const execute = (line: string) => {
        const { operation, operandOne, operandTwo } = parseSingleLine(line);

        logger.info(
            `Parsing the instruction ${operation} with operand one is ${operandOne} ${
                operandTwo ? " and operand two is " + operandTwo : ""
            }.`
        );

        switch (operation) {
            // --- Data movement ---
            case "mov":
                mov(operandTwo ?? "", operandOne ?? "");
                break;
            case "lea":
                lea(operandOne ?? "", operandTwo ?? "");
                break;
            case "xchg":
                xchg(operandOne ?? "", operandTwo ?? "");
                break;

            // --- Stack ---
            case "push":
                push(operandOne ?? "");
                break;
            case "pop":
                pop(operandOne ?? "");
                break;

            // --- Arithmetic ---
            case "add":
                add(operandOne ?? "", operandTwo ?? "");
                break;
            case "sub":
                sub(operandOne ?? "", operandTwo ?? "");
                break;
            case "inc":
                inc(operandOne ?? "");
                break;
            case "dec":
                dec(operandOne ?? "");
                break;
            case "neg":
                neg(operandOne ?? "");
                break;
            case "mul":
                mul(operandOne ?? "");
                break;
            case "imul":
                imul(operandOne ?? "", operandTwo ?? "");
                break;
            case "div":
                div(operandOne ?? "");
                break;

            // --- Logical ---
            case "and":
                and(operandOne ?? "", operandTwo ?? "");
                break;
            case "or":
                or(operandOne ?? "", operandTwo ?? "");
                break;
            case "xor":
                xor(operandOne ?? "", operandTwo ?? "");
                break;
            case "not":
                not(operandOne ?? "");
                break;
            case "shl":
                shl(operandOne ?? "", operandTwo ?? "");
                break;
            case "shr":
                shr(operandOne ?? "", operandTwo ?? "");
                break;

            // --- Compare / Test ---
            case "cmp":
                cmp(operandOne ?? "", operandTwo ?? "");
                break;
            case "test":
                test(operandOne ?? "", operandTwo ?? "");
                break;

            // --- NOP ---
            case "nop":
                logger.info("NOP — no operation");
                break;

            default:
                logger.error(`Unknown operation: ${operation}`);
                break;
        }
    };

    const executeCurrentInstruction = useCallback(() => {
        captureSnapshot();

        let rip = bitArrayToNumber(registers.rip);
        const opcode = getMemoryBytes(rip, 10);

        let instructionLine;
        try {
            instructionLine = disassemble(opcode);
        } catch {
            logger.error("Cannot decode instruction at current RIP.");
            setRunning(false);
            return false;
        }

        if (instructionLine.instruction === "unknown") {
            logger.error("Hit unknown instruction — stopping.");
            setRunning(false);
            return false;
        }

        const { operation, operandOne } = parseSingleLine(instructionLine.instruction);

        // Handle jump instructions directly (they modify RIP)
        if (JUMP_OPS.has(operation)) {
            const offset = parseInt(operandOne ?? "0", 10);
            const nextRip = rip + instructionLine.length;
            const rflags = registers.rflags ?? Array(64).fill(0);
            const ZF = rflags[57];
            const SF = rflags[56];

            let shouldJump = false;

            switch (operation) {
                case "jmp":
                    shouldJump = true;
                    break;
                case "je":
                case "jz":
                    shouldJump = ZF === 1;
                    break;
                case "jne":
                case "jnz":
                    shouldJump = ZF === 0;
                    break;
                case "jg":
                    shouldJump = ZF === 0 && SF === 0;
                    break;
                case "jl":
                    shouldJump = SF === 1;
                    break;
            }

            if (shouldJump) {
                const target = nextRip + offset;
                regset("rip", numberToBitArray(target));
                logger.info(`${operation.toUpperCase()} taken → jumping to 0x${target.toString(16)}`);
            } else {
                regset("rip", numberToBitArray(nextRip));
                logger.info(`${operation.toUpperCase()} not taken → continuing to next instruction`);
            }
            return true;
        }

        // Normal (non-jump) instructions
        execute(instructionLine.instruction);
        rip += instructionLine.length;
        regset("rip", numberToBitArray(rip));
        return true;
    }, [registers, getMemoryBytes, captureSnapshot, logger, regset]);

    /** Step Back — restore the previous snapshot */
    const stepBack = useCallback(() => {
        const snapshot = popSnapshot();
        if (!snapshot) {
            logger.info("No history to step back to.");
            return;
        }
        restoreRegisters(snapshot.registers);
        restoreMemory(snapshot.memory);
        logger.info(`Stepped back (${historySize - 1} snapshots remaining)`);
    }, [popSnapshot, restoreRegisters, restoreMemory, logger, historySize]);

    /** Run — execute instructions until a breakpoint is hit or end of code */
    const runUntilBreakpoint = useCallback(() => {
        // We use a synchronous loop with a step count limit.
        // Since React batches state updates, we execute step-by-step with setTimeout
        // to allow the UI to update between steps.
        setRunning(true);
        logger.info("Running until breakpoint...");
    }, [setRunning, logger]);

    // Effect-based run loop: when isRunning, execute one step per render cycle
    useEffect(() => {
        if (!isRunning) return;

        const stepCount = { current: 0 };

        const runStep = () => {
            if (!isRunning) return;
            if (stepCount.current >= MAX_RUN_STEPS) {
                logger.error(`Safety limit reached (${MAX_RUN_STEPS} steps). Stopping.`);
                setRunning(false);
                return;
            }

            const rip = bitArrayToNumber(registersRef.current.rip);

            // Check breakpoint (skip the very first instruction so "Run" always advances at least once)
            if (stepCount.current > 0 && breakpoints.has(rip)) {
                logger.info(`Breakpoint hit at 0x${rip.toString(16)}`);
                setRunning(false);
                return;
            }

            stepCount.current++;

            // Capture snapshot
            const regSnap: { [key: string]: number[] } = {};
            for (const key of Object.keys(registersRef.current)) {
                regSnap[key] = [...registersRef.current[key]];
            }
            const memSnap = { ...memoryRef.current };
            pushSnapshot({ registers: regSnap, memory: memSnap });

            // Decode & execute
            const opcode = getMemoryBytes(rip, 10);
            let instructionLine;
            try {
                instructionLine = disassemble(opcode);
            } catch {
                logger.error("Cannot decode instruction — stopping run.");
                setRunning(false);
                return;
            }
            if (instructionLine.instruction === "unknown") {
                logger.error("Hit unknown instruction — stopping run.");
                setRunning(false);
                return;
            }

            const { operation, operandOne } = parseSingleLine(instructionLine.instruction);

            if (JUMP_OPS.has(operation)) {
                const offset = parseInt(operandOne ?? "0", 10);
                const nextRip = rip + instructionLine.length;
                const rflags = registersRef.current.rflags ?? Array(64).fill(0);
                const ZF = rflags[57];
                const SF = rflags[56];
                let shouldJump = false;
                switch (operation) {
                    case "jmp": shouldJump = true; break;
                    case "je": case "jz": shouldJump = ZF === 1; break;
                    case "jne": case "jnz": shouldJump = ZF === 0; break;
                    case "jg": shouldJump = ZF === 0 && SF === 0; break;
                    case "jl": shouldJump = SF === 1; break;
                }
                if (shouldJump) {
                    regset("rip", numberToBitArray(nextRip + offset));
                } else {
                    regset("rip", numberToBitArray(nextRip));
                }
            } else {
                execute(instructionLine.instruction);
                regset("rip", numberToBitArray(rip + instructionLine.length));
            }

            // Schedule next step to allow React to process state updates
            setTimeout(runStep, 0);
        };

        // Start the loop
        const timer = setTimeout(runStep, 0);
        return () => clearTimeout(timer);
    }, [isRunning]);

    return (
        <div>
            {modalStatus.customInstruction && (
                <Modal
                    title="Instruction"
                    handleClose={() => {
                        closeModal("customInstruction");
                    }}
                >
                    <CustomInstruction
                        handleExecution={(line: string) => {
                            captureSnapshot();
                            execute(line);
                            closeModal("customInstruction");
                        }}
                    />
                </Modal>
            )}
            <div className="bg-[#555] bg-opacity-50 backdrop-blur-lg mt-2">
                <h1 className="bg-primary text-secondary w-full py-1 text-sm text-center uppercase mb-3">
                    Control execution
                </h1>
                <div className="px-2">
                    <div className="grid grid-cols-2 gap-1 -mt-1">
                        <Button
                            text="Step"
                            handleClick={() => executeCurrentInstruction()}
                            disabled={isRunning}
                        />
                        <Button
                            text={isRunning ? "Stop" : "Run"}
                            handleClick={() => {
                                if (isRunning) {
                                    setRunning(false);
                                } else {
                                    runUntilBreakpoint();
                                }
                            }}
                        />
                        <Button
                            text={`Undo${canStepBack ? ` (${historySize})` : ""}`}
                            handleClick={stepBack}
                            disabled={!canStepBack || isRunning}
                        />
                        <Button
                            text="Custom"
                            handleClick={() => openModal("customInstruction")}
                            disabled={isRunning}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ExecutionController;
