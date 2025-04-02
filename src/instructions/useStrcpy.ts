import { useMemoryContext } from "@context";

const useStrcpy = () => {
    const {  memset } = useMemoryContext();

    const strcpy = (dest: number, str: string) => {
        for (let i = 0; i < str.length; i++) {
            memset(dest + i, str.charCodeAt(i));
        }

        // Null-terminate the string
        memset(dest + str.length, 0);
    };

    return { strcpy };
};

export default useStrcpy;
