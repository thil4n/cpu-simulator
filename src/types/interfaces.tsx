export interface Category {
    _id?: string | null;
    title: string;
    stock?: number;
    remarks?: string;
    attributes?: Attribute[] | string[];
}
export interface Product {
    _id?: string | null;
    title: string;
    img?: string[];
    stock?: number;
    remarks?: string;
    category?: string | { _id: string; title: string };
    attributes: { [key: string]: string | number };
}
export interface Attribute {
    _id?: string | null;
    title: string;
    type: string;
    options?: Option[] | string[];
}

export interface Option {
    id: string;
    title: string;
}

export interface FormField {
    id: string;
    icon?: unknown;
    required: boolean;
    label: string;
    data: number | string | string[] | object[] | null;
    type: string;
    error: string | null;
    optList?: { id: string; title: string }[];
    optTitle?: string;
    cols?: number;
    rows?: number;
    multiple?: boolean;
    min?: number;
    max?: number;
    placeHolder?: string;
}

export interface FormFieldSet<T extends FormField> {
    [key: string]: T;
}
