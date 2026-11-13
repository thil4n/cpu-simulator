import { useState } from "react";

const useLoader = () => {
    const [loading, setLoading] = useState(false);

    const showLoader = () => setLoading(true);
    const hideLoader = () => setLoading(false);

    return { loading, showLoader, hideLoader };
};

export default useLoader;
