import useAdd from "./useAdd";
import useSub from "./useSub";
import useCmp from "./useCmp";
import useMov from "./useMov";
import usePop from "./usePop";
import usePush from "./usePush";

const useInstructions = () => {
    const push = usePush();
    const pop = usePop();
    const mov = useMov();
    const add = useAdd();
    const sub = useSub();
    const cmp = useCmp();

    return {
        push,
        pop,
        mov,
        add,
        sub,
        cmp,
    };
};
export default useInstructions;
