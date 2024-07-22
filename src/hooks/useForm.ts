import { useState } from "react";

interface FormData {
    [key: string]: any;
}

interface Errors {
    [key: string]: string;
}

const useForm = (initialState: FormData) => {
    const [formData, setFormData] = useState<FormData>(initialState);
    const [errors, setErrors] = useState<Errors>({});

    const handleChange = (name, value) => {
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    return {
        formData,
        setFormData,
        errors,
        handleChange,
        setErrors,
    };
};

export default useForm;
