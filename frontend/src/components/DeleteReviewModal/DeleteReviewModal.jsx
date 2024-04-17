import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import { deleteReview } from '../../store/reviews';
import { fetchSpot } from '../../store/spots';
import "./DeleteReviewModal.css"

function DeleteReviewModal({ reviewId, spotId }) {
   console.log(spotId, 'spotId')
    const dispatch = useDispatch();
    const { closeModal } = useModal();
//  console.log(reviewId)
    const handleDelete = (reviewId, spotId) => {
        // console.log(reviewId, 'reviewid from modal')
        dispatch(deleteReview(reviewId))
        .then(closeModal)
        // .then(()=>  dispatch(fetchSpot(spotId)))
      
    };

   

    return (
        <div className="modal">
            <div className="modal-content">
                <span className="close" onClick={closeModal}>&times;</span>
                <h2>Confirm Delete</h2>
                <p>Are you sure you want to delete this review?</p>
                <div className="modal-buttons">
                <button id='yes' onClick={() => handleDelete(reviewId)}>Yes</button>
                    <button id='no' onClick={(closeModal)}>No</button>
                </div>
            </div>
        </div>
    );
}

export default DeleteReviewModal;
