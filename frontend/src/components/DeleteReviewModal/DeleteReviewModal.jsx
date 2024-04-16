import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import { deleteReview } from '../../store/spots';

function DeleteReviewModal({ reviewId, onClose }) {
    const dispatch = useDispatch();

    const handleDelete = () => {
        dispatch(deleteReview(reviewId))
        // Dispatch action to delete the review or perform any necessary operations
        // dispatch(deleteReview(reviewId));
        // You may also want to handle closing the modal after deletion
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
                    <button onClick={handleDelete}>Yes</button>
                    <button onClick={closeModal}>No</button>
                </div>
            </div>
        </div>
    );
}

export default DeleteReviewModal;
