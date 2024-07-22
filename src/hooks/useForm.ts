import { useState } from "react";
import Joi from "joi-browser";

interface FormData {
    [key: string]: any;
}

interface Errors {
    [key: string]: string;
}

const useForm = (initialState: FormData, schema: Joi.Schema) => {
    const [formData, setFormData] = useState<FormData>(initialState);
    const [errors, setErrors] = useState<Errors>({});

    const handleChange = (name, value) => {
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const validate = (): Errors | null => {
        const options = { abortEarly: false };
        const { error } = Joi.validate(formData, schema, options);
        if (!error) return null;

        const errors: Errors = {};
        for (let item of error.details) errors[item.path[0]] = item.message;
        return errors;
    };

    return {
        formData,
        setFormData,
        errors,
        handleChange,
        validate,
        setErrors,
    };
};

export default useForm;
