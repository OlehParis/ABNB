import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import { deleteReview } from '../../store/spots';

function DeleteReviewModal({ reviewId, onClose }) {
    const dispatch = useDispatch();
//  console.log(reviewId)
    const handleDelete = (reviewId) => {
        console.log(reviewId, 'reviewid from modal')
        dispatch(deleteReview(reviewId))
        
        onClose();
    };

    const closeModal = () => {
        onClose();
    };

    return (
        <div className="modal">
            <div className="modal-content">
                <span className="close" onClick={closeModal}>&times;</span>
                <h2>Confirm Delete</h2>
                <p>Are you sure you want to delete this review?</p>
                <div className="modal-buttons">
                <button onClick={() => handleDelete(reviewId)}>Yes</button>
                    <button  onClick={closeModal}>No</button>
                </div>
            </div>
        </div>
    );
}

export default DeleteReviewModal;
