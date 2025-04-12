import { useMemoryContext, useRegisterContext } from "@context";
import { bitArrayToNumber } from "@utils";
import { Cpu } from "lucide-react";

const InstructionView = () => {
    const { getMemoryBytes } = useMemoryContext();
    const { registers } = useRegisterContext();

    const rip = bitArrayToNumber(registers.rip);

    const opcodes = getMemoryBytes(rip, 30);

    console.log(opcodes);

    return "hi";

    // return (
    //     <div>
    //         <h1 className="bg-primary text-secondary w-full py-1 text-sm text-center uppercase">
    //             ASSEMBLY INSTRUCTIONS
    //         </h1>
    //         <div className="bg-[#555] bg-opacity-50 backdrop-blur-lg px-6 py-4 min-h-[400px]">
    //             {instructions.map((line: any) => {
    //                 return (
    //                     <div className="flex py-1 px-2 border-b border-secondary hover:bg-primary text-slate-400 hover:text-secondary  cursor-pointer">
    //                         <div className="w-32">{line.operation}</div>
    //                         <div className="w-[300px]">{line.operandOne}</div>
    //                         <div className="">{line.operandTwo}</div>
    //                     </div>
    //                 );
    //             })}
    //             {instructions.length == 0 && (
    //                 <div className="w-full flex flex-col justify-center items-center">
    //                     <Cpu
    //                         size={64}
    //                         className="text-7xl text-secondary mb-4"
    //                     />
    //                     <h1 className="text-secondary text-sm">
    //                         No instructions loaded. Click on Load Program to
    //                         load instructions.
    //                     </h1>
    //                 </div>
    //             )}
    //         </div>
    //     </div>
    // );
};

export default InstructionView;
