const strcpy = (dest: number, str: string) => {
    const memoryValuesCopy = { ...memory };

    for (let i = 0; i < str.length; i++) {
        memoryValuesCopy[dest + i] = str.charCodeAt(i);
    }

    // Null-terminate the string
    memoryValuesCopy[dest + str.length] = 0;

    memset(memoryValuesCopy);
    console.log(memoryValuesCopy);
};

export default strcpy;
