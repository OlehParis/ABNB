import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import { fetchDeleteSpot } from '../../store/spots';
// import { fetchSpot } from '../../store/spots';
import "./DeleteReviewModal.css"

function DeleteSpotModal( {spotId} ) {

    const dispatch = useDispatch();
    const { closeModal } = useModal();
//  console.log(reviewId)
    const handleDeleteSpot = () => {
        dispatch(fetchDeleteSpot(spotId))
        .then(closeModal)
        // .then(()=>  dispatch(fetchSpot(spotId)))
    };

    return (
        <div className="modal">
            <div className="modal-content">
                <span className="close" onClick={closeModal}>&times;</span>
                <h2>Confirm Delete</h2>
                <p>Are you sure you want to delete this spot?</p>
                <div className="modal-buttons">
                <button id='yes' onClick={() => handleDeleteSpot()}>Yes</button>
                    <button id='no' onClick={(closeModal)}>No</button>
                </div>
            </div>
        </div>
    );
}

export default DeleteSpotModal;
