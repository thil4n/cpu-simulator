import useAdd from "./useAdd";
import useSub from "./useSub";
import useCmp from "./useCmp";
import useMov from "./useMov";
import usePop from "./usePop";
import usePush from "./usePush";
import useLogical from "./useLogical";
import useShift from "./useShift";
import useIncDec from "./useIncDec";
import useMulDiv from "./useMulDiv";
import useTest from "./useTest";
import useXchg from "./useXchg";
import useLea from "./useLea";

const useInstructions = () => {
    const push = usePush();
    const pop = usePop();
    const mov = useMov();
    const add = useAdd();
    const sub = useSub();
    const cmp = useCmp();
    const logical = useLogical();
    const shift = useShift();
    const incDec = useIncDec();
    const mulDiv = useMulDiv();
    const test = useTest();
    const xchg = useXchg();
    const lea = useLea();

    return {
        push,
        pop,
        mov,
        add,
        sub,
        cmp,
        ...logical,     // and, or, xor, not
        ...shift,        // shl, shr
        ...incDec,       // inc, dec, neg
        ...mulDiv,       // mul, imul, div
        test,
        xchg,
        lea,
    };
};
export default useInstructions;
