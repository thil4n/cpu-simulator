import { useRegisterContext } from "@context/MemoryContext"; 

export const useRegister = () => {
  const { registers, setRegister } = useRegisterContext();

  const updateRegister = (key: string, value: number) => {
    if (registers[key]) {
      setRegister(key, value);
    } else {
      console.warn(`Register ${key} does not exist`);
    }
  };

  return { registers, updateRegister };
};
