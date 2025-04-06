export const parseSingleLine = (line: string) => {
    const match = line.trim().match(/(\S+)(?:\s+(.*))?/);

    if (!match) {
        throw new Error("Invalid instruction format");
    }

    const [operation, operands = ""] = match.slice(1);
    const [operandOne = null, operandTwo = null] = operands
        .split(/[,\s]+/)
        .filter(Boolean);

    return { operation, operandOne, operandTwo };
};

export const parseAddr = (address: string) => {
    return parseInt(address.substring(2), 16);
};
