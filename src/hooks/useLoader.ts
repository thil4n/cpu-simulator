import { useState } from "react";
import { Skeleton } from "@components";

const useLoader = () => {
    const [loading, setLoading] = useState(false);

    const showLoader = () => setLoading(true);
    const hideLoader = () => setLoading(false);

    return { loading, showLoader, hideLoader, Skeleton };
};

export default useLoader;
