import { Input, Select } from "@components";
import { useForm } from "@hooks";
import { useEffect, useState } from "react";

interface Cell {
  address: number;
  value: number;
}

const MemoryView = ({ memoryValues }) => {
  const { formData, handleChange } = useForm({
    startAddress: "1000",
    wordCount: "24",
    wordSize: "1",
    displayType: "hexadecimal",
  });

  const [memoryCells, setMemoryCells] = useState<Cell[]>([]);
  const [status, setStatus] = useState("...");
  const [selection, setSelection] = useState<{
    start: number | null;
    end: number | null;
  }>({
    start: null,
    end: null,
  });

  const buildMemoryView = () => {
    let cells = [];

    for (let i = 0; i < formData.wordCount; i++) {
      const address = formData.startAddress + i * formData.wordSize;

      // Convert binary string to hexadecimal, fallback to "00" if undefined
      const value = memoryValues[address]
        ? parseInt(memoryValues[address], 2).toString(16).padStart(2, "0")
        : "00";

      cells.push({
        address,
        value,
      });
    }

    setMemoryCells(cells);
  };

  useEffect(() => {
    buildMemoryView();
  }, [formData]);

  const handleHover = ({ address, value }) => {
    setStatus(`Memory cell at ${address} with the value ${value}`);
  };

  const handleCellClick = (address: number) => {
    setSelection((prev) => {
      if (prev.start === null) {
        return { start: address, end: null }; // Set start address
      } else if (prev.end === null) {
        return { start: prev.start, end: address }; // Set end address
      } else {
        return { start: address, end: null }; // Reset selection
      }
    });
  };

  const isSelected = (address: number) => {
    const { start, end } = selection;
    return start !== null && end !== null && address >= start && address <= end;
  };

  return (
    <div className="w-full">
      <div className="grid grid-cols-4 gap-2">
        <Input
          label="Start address"
          name={"startAddress"}
          value={formData.startAddress}
          handleChange={handleChange}
        />
        <Input
          label="Word count"
          name={"wordCount"}
          type="number"
          value={formData.wordCount}
          handleChange={handleChange}
        />
        <Select
          label="Word size"
          optList={[
            {
              id: "1",
              title: "1 Bytes",
            },
            {
              id: "2",
              title: "2 Bytes",
            },
            {
              id: "4",
              title: "4 Bytes",
            },
            {
              id: "8",
              title: "8 Bytes",
            },
          ]}
          name={"wordSize"}
          value={formData.wordSize}
          handleChange={handleChange}
        />
        <Select
          label="Display in"
          optList={[
            {
              id: "hexadecimal",
              title: "Hexadecimal",
            },
            {
              id: "binary",
              title: "Binary",
            },
            {
              id: "octal",
              title: "Octal",
            },
            {
              id: "decimal",
              title: "Decimal",
            },
          ]}
          name={"displayType"}
          value={formData.displayType}
          handleChange={handleChange}
        />
      </div>

      <div className="w-full py-2">{status}</div>

      <div className="w-full p-2 grid grid-cols-24 gap-1 mt-4 mb-6">
        {memoryCells.map((memoryCell) => (
          <div
            key={memoryCell.address}
            className={`cursor-pointer text-sm p-2 text-center border border-gray-500 rounded-sm 
              ${
                isSelected(memoryCell.address)
                  ? "bg-blue-400 text-white"
                  : "bg-primary text-secondary"
              }
              ${
                formData.wordSize == 8
                  ? "col-span-8"
                  : formData.wordSize == 4
                  ? "col-span-4"
                  : formData.wordSize == 2
                  ? "col-span-2"
                  : "col-span-1"
              }

              hover:bg-secondary hover:text-white`}
            // onClick={() => handleCellClick(memoryCell.address)}
            onMouseEnter={() => {
              handleHover(memoryCell);
            }}
          >
            0x{memoryCell.value}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MemoryView;
