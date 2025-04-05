import { Input, Select } from "@components";
import { useForm } from "@hooks";
import { useEffect, useState } from "react";

interface Cell {
    address: number;
    value: number;
}

const MemoryView = ({ register }) => {
    const { formData, handleChange } = useForm({
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

    const formatValue = (value: number, displayType: string): string => {
        switch (displayType) {
            case "hexadecimal":
                return value.toString(16).padStart(2, "0").toUpperCase();
            case "binary":
                return value.toString(2).padStart(8, "0");
            case "octal":
                return value.toString(8);
            case "decimal":
                return value.toString(10);
            default:
                return value.toString(16).padStart(2, "0").toUpperCase();
        }
    };

    const buildMemoryView = () => {
        let cells = [];

        for (let i = 0; i < parseInt(formData.wordCount); i++) {
            const address =
                parseInt(formData.startAddress) +
                i * parseInt(formData.wordSize);

            // Fallback to 0 if undefined
            const value = 0;

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

    const isSelected = (address: number) => {
        const { start, end } = selection;
        return (
            start !== null && end !== null && address >= start && address <= end
        );
    };

    return (
        <div className="w-full">
            <div className="grid grid-cols-4 gap-2">
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
                    >
                        {formData.displayType === "hexadecimal" ? "0x" : ""}
                        {formatValue(memoryCell.value, formData.displayType)}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MemoryView;
