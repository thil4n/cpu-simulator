import { Button } from "@components";
import { useLoggerContext, useRegisterContext } from "@context";
import { bitArrayToNumber } from "@utils";

const MemoryPanel = ({ showMemory }) => {
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
                        handleClick={function (): void {
                            throw new Error("Function not implemented.");
                        }}
                    />
                    <Button
                        text={".BSS"}
                        handleClick={function (): void {
                            throw new Error("Function not implemented.");
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
                        handleClick={function (): void {
                            throw new Error("Function not implemented.");
                        }}
                    />
                    <Button
                        text={"Address"}
                        handleClick={function (): void {
                            throw new Error("Function not implemented.");
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

export default MemoryPanel;
