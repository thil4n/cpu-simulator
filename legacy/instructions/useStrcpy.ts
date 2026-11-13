import { useMemoryContext } from "@context";

const useStrcpy = () => {
    const { setMemoryByte } = useMemoryContext();

    const strcpy = (dest: number, str: string) => {
        for (let i = 0; i < str.length; i++) {
            setMemoryByte(dest + i, str.charCodeAt(i));
        }

        // Null-terminate the string
        setMemoryByte(dest + str.length, 0);
    };

    return { strcpy };
};

export default useStrcpy;
