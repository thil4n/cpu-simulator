import { useState } from "react";

const useModal = (initModalState) => {
    const [modalStatus, setModalStatus] = useState(initModalState);

    const toggleModal = (modalId) => {
        setModalStatus((prevStatus) => ({
            ...prevStatus,
            [modalId]: !prevStatus[modalId],
        }));
    };

    const closeModal = (modalId) => {
        setModalStatus((prevStatus) => ({
            ...prevStatus,
            [modalId]: false,
        }));
    };

    const openModal = (modalId) => {
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
