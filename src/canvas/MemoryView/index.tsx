import { Input } from "@components";


const MemoryView = ({ startAddr, memoryValues, handleClose, step = 1 }) => {
    const count = 20;
    let cells = [];
  
    for (let i = 0; i < count; i++) {
      const addr = startAddr + i * step;
  
      // Convert binary string to hexadecimal, fallback to "00" if undefined
      const value = memoryValues[addr]
        ? parseInt(memoryValues[addr], 2).toString(16).padStart(2, "0")
        : "00";
  
      cells.push({
        addr,
        value,
      });
    }
  
    return (
        
      <div className="w-full">

        <Input name={""} value={""} handleChange={function (e: React.ChangeEvent<HTMLInputElement>): void {
                throw new Error("Function not implemented.");
            } } />
        
      <div className="w-full p-2 flex flex-wrap gap-1 mt-4 mb-6">
        {cells.map((item) => (
          <div
            key={item.addr}
            className="bg-primary cursor-pointer text-secondary hover:bg-secondary hover:text-white text-sm p-2 w-12 text-center border border-gray-500 rounded-sm"
          >
            
            0x{item.value}
          </div>
        ))}
      </div>
      </div>
    );
  };
  
  export default MemoryView;
  
