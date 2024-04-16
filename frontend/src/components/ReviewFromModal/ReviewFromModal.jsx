import { useState } from 'react';
// import * as sessionActions from '../../store/session';
import { useDispatch } from 'react-redux';
import { fetchSpotReview } from '../../store/spots';
import { fetchSpotByID } from '../../store/spots';
import { FaStar , FaRegStar} from 'react-icons/fa';
import { useModal } from '../../context/Modal';
import './ReviewFromModal.css';



function StarRating({ defaultRating, onChange }) {
    const totalStars = 5;
    const [hoverRating, setHoverRating] = useState(0);
    const [selectedRating, setSelectedRating] = useState(defaultRating);
  
    const handleHover = (value) => {
      setHoverRating(value);
    };
  
    const handleClick = (value) => {
      setSelectedRating(value === selectedRating ? 0 : value);
      setHoverRating(0);
      onChange(value === selectedRating ? 0 : value);
    };
  
    return (
        <div className='stars-container'>
      <div className='stars2'>
        {[...Array(totalStars)].map((_, index) => {
          const starValue = index + 1;
          return (
            <span
              key={index}
              onMouseEnter={() => handleHover(starValue)}
              onMouseLeave={() => handleHover(0)}
              onClick={() => handleClick(starValue)}
            >
              {starValue <= (hoverRating || selectedRating) ? (
                <FaStar color="#ffc107"  /> 
              ) : (
                <FaRegStar color="#e4e5e9"  />
              )}
            </span>
            
          );
        })}
      </div>
        <span className='stars-text'>Stars</span>
      </div>
    );
  }



  function ReviewFromModal({ spotId, spot }) {
    const dispatch = useDispatch()
    const { closeModal } = useModal();
    const [review, setReview] = useState('');
    const [stars, setStars] = useState(0);

    const handleReviewChange = (event) => {
      setReview(event.target.value);
    };
  
    const handleRatingChange = (value) => {
      setStars(value);
    };
  
    const handleSubmit = () => {
    const Reviews ={
        spotId,
        review,
        stars
    }
    dispatch(fetchSpotReview(Reviews))
    .then(()=> dispatch(fetchSpotByID(spotId)))
    .then(() => closeModal())
    .then(()=> dispatch(fetchSpotByID(spotId)))
    };
  
    return (
      <div className="field">
        <h2>How was your stay?</h2>
        <textarea
          placeholder="Leave your review here..."
          value={review}
          onChange={handleReviewChange}
        ></textarea>
        <StarRating defaultRating={stars} className='stars2' onChange={handleRatingChange} /> 
      
        <button onClick={handleSubmit} disabled={review.length < 10}>
          Submit Your Review
        </button>
      </div>
    );
  }
  
  export default ReviewFromModal;
  