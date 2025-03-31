import intcpy from "./intcpy";
import strcpy from "./strcpy";
import mov from "./mov";
import push from "./push";
import pop from "./pop";
import sub from "./sub";
import add from "./add";
import cmp from "./cmp";

const useInstructions = () => {
    return { intcpy, strcpy, mov, push, pop, add, sub, cmp };
};

export default useInstructions;
