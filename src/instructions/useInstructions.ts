import useMov from "./useMov";
import usePop from "./usePop";
import usePush from "./usePush";
import useStrcpy from "./useStrcpy";

const useInstructions = () => {
    const push = usePush();
    const pop = usePop();
    const mov = useMov();

    // const add = useAdd();
    // const pop = usePop();
    // const sub = useSub();
    // const mul = useMul();
    // const div = useDiv();
    // const cmp = useCmp();
    // const jmp = useJmp();
    // const call = useCall();
    // const ret = useRet();
    // const and = useAnd();
    // const or = useOr();
    // const xor = useXor();
    // const not = useNot();
    // const inc = useInc();
    // const dec = useDec();

    return {
        push,
        pop,
        mov /*,add, sub, mul, div, cmp, jmp, call, ret, and, or, xor, not, inc, dec */,
    };
};
export default useInstructions;
