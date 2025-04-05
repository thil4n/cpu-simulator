import { useState } from "react";

type ModalState = Record<string, boolean>;

const useModal = (initModalState: ModalState = {}) => {
    const [modalStatus, setModalStatus] = useState<ModalState>(initModalState);

    const toggleModal = (modalId: string) => {
        setModalStatus((prevStatus) => ({
            ...prevStatus,
            [modalId]: !prevStatus[modalId],
        }));
    };

    const closeModal = (modalId: string) => {
        setModalStatus((prevStatus) => ({
            ...prevStatus,
            [modalId]: false,
        }));
    };

    const openModal = (modalId: string) => {
        setModalStatus((prevStatus) => ({
            ...prevStatus,
            [modalId]: true,
        }));
    };

    return {
        modalStatus,
        toggleModal,
        closeModal,
        openModal,
    };
};

export default useModal;
