import { Button } from "@components";
import { useLoggerContext, useRegisterContext } from "@context";
import { bitArrayToNumber } from "@utils";

interface MemoryPanelProps {
    showMemory: (startAddr: number) => void;
}

const MemoryPanel = ({ showMemory }: MemoryPanelProps) => {
    const { registers } = useRegisterContext();
    const logger = useLoggerContext();

    return (
        <div className="bg-[#555] bg-opacity-50 backdrop-blur-lg">
            <h1 className="bg-primary text-secondary w-full py-1 text-sm text-center uppercase">
                Examine Memory
            </h1>
            <div className="px-2 py2 mt-3">
                <div className="grid grid-cols-3 gap-x-1">
                    <Button
                        text={"Stack"}
                        handleClick={() => {
                            const rsp = bitArrayToNumber(registers.rsp);

                            logger.info("Showing the stack area.");

                            showMemory(rsp);
                        }}
                    />
                    <Button
                        text={"Heap"}
                        handleClick={() => {
                            logger.info("Heap view is not yet implemented.");
                        }}
                    />
                    <Button
                        text={".BSS"}
                        handleClick={() => {
                            logger.info(".BSS view is not yet implemented.");
                        }}
                    />
                    <Button
                        text={".TXT"}
                        handleClick={() => {
                            const rip = bitArrayToNumber(registers.rip);

                            logger.info("Showing the text segment.");

                            showMemory(rip);
                        }}
                    />
                    <Button
                        text={".DATA"}
                        handleClick={() => {
                            logger.info(".DATA view is not yet implemented.");
                        }}
                    />
                    <Button
                        text={"Address"}
                        handleClick={() => {
                            logger.info("Address view is not yet implemented.");
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

export default MemoryPanel;
