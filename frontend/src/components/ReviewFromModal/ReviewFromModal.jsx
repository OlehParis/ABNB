import { useState } from 'react';
// import * as sessionActions from '../../store/session';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import './ReviewFromModal.css';



function ReviewFromModal () {
    const dispatch = useDispatch();
    // const [errors, setErrors] = useState({});
    const { closeModal } = useModal();
    
    return (
        <>
        <h1>Hello from Modal MotherFather!</h1>
        </>
    )
}

export default ReviewFromModal;
