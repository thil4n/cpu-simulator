import {
    useLoggerContext,
    useMemoryContext,
    useRegisterContext,
} from "@context";
import { bitArrayToNumber, numberToBitArray, parseSingleLine } from "@utils";
import { disassemble } from "@lib";

import { Button, Modal } from "@components";

import useInstructions from "../../instructions/useInstructions";
import { useModal } from "@hooks";
import CustomInstruction from "./CustomInstruction";

const JUMP_OPS = new Set(["jmp", "je", "jz", "jne", "jnz", "jg", "jl"]);

const ExecutionController = () => {
    const { getMemoryBytes } = useMemoryContext();
    const { registers, regset } = useRegisterContext();
    const logger = useLoggerContext();

    const {
        push, pop, mov, add, sub, cmp,
        and, or, xor, not,
        shl, shr,
        inc, dec, neg,
        mul, imul, div,
        test, xchg, lea,
    } = useInstructions();

    const { modalStatus, openModal, closeModal } = useModal();

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

    const executeCurrentInstruction = () => {
        let rip = bitArrayToNumber(registers.rip);
        const opcode = getMemoryBytes(rip, 10);

        const instructionLine = disassemble(opcode);
        const { operation, operandOne } = parseSingleLine(instructionLine.instruction);

        // Handle jump instructions directly (they modify RIP)
        if (JUMP_OPS.has(operation)) {
            const offset = parseInt(operandOne ?? "0", 10);
            const nextRip = rip + instructionLine.length; // address after this instruction
            const rflags = registers.rflags ?? Array(64).fill(0);
            const ZF = rflags[57]; // bit 6
            const SF = rflags[56]; // bit 7
            // CF at bit 0 (index 63), OF at bit 11 (index 52)

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
                    // Jump if greater: ZF=0 and SF=0 (simplified: no OF check)
                    shouldJump = ZF === 0 && SF === 0;
                    break;
                case "jl":
                    // Jump if less: SF=1 (simplified: no OF check)
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
            return;
        }

        // Normal (non-jump) instructions
        execute(instructionLine.instruction);
        rip += instructionLine.length;
        regset("rip", numberToBitArray(rip));
    };

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
                            text="Execute"
                            handleClick={() => executeCurrentInstruction()}
                        />
                        <Button
                            text="Custom"
                            handleClick={() => openModal("customInstruction")}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ExecutionController;
