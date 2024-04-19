import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchSpot } from '../../store/spots';
import './SpotDetails.css';
import { FaStar , FaRegStar} from 'react-icons/fa';
import OpenModalButton from '../OpenModalButton/OpenModalButton'
import ReviewFromModal from '../ReviewFromModal/ReviewFromModal'
import DeleteReviewModal from '../DeleteReviewModal/DeleteReviewModal';
import { fetchSpotReview } from '../../store/reviews';

function StarRating({ stars }) {
    const totalStars = 5;
  
    const filledStars = Array.from({ length: stars }, (_, index) => (
      <FaStar key={index} color="#ffc107" />
    ));
  
    const emptyStars = Array.from({ length: totalStars - stars }, (_, index) => (
      <FaRegStar key={index} color="#e4e5e9" />
    ));
    return (
      <div>
        {filledStars}
        {emptyStars}
      </div>
    );
  }

function SpotDetails() {

    const { spotId } = useParams();
    const dispatch = useDispatch()
    const spotData = useSelector(state => state.spots[spotId]);
    const session = useSelector(state => state.session)
    const reviews = useSelector(state => state.reviews)
  
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false); 
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedReviewId, setSelectedReviewId] = useState(null);

    const openReviewModal = () => {
        setIsReviewModalOpen(true);
    };
    const closeReviewModal = () => {
        setIsReviewModalOpen(false); 
    };

    const openDeleteModal = (reviewId) => {
      setSelectedReviewId(reviewId);
      setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
      setSelectedReviewId(null);
      setIsDeleteModalOpen(false);
  };

    const reviewModal = isReviewModalOpen ? <ReviewFromModal onClose={closeReviewModal} /> : null;

    useEffect(() => {
        dispatch(fetchSpot(spotId));
      }, [dispatch, spotId]);

      if (!spotData ) {
        return <div>Loading...</div>;
    }
 
    const curUserId = session.user?.id ?? null;
    const spotOwnerId = spotData.ownerId
   
    let reviewMatchCurUserId = false;
      for (let reviewId in reviews) {
    const review = reviews[reviewId];
    console.log(review)
    if (review.userId === curUserId || review.User.id === curUserId) {
      console.log(review.userId === curUserId , 'line76')
        reviewMatchCurUserId = true;
        break; 
    }
    }  
    
    const dontShowButton = reviewMatchCurUserId || curUserId === spotOwnerId;
    const reviewsIsEmpty = Object.keys(reviews).length === 0;
    const beTheFirst = reviewsIsEmpty && curUserId && spotOwnerId !== curUserId;
    const notLogIn = session.user === null;

    return (
        <div className="spot-details">
        <h2>{spotData.name}</h2>
        <p>{spotData.address}, {spotData.state},  {spotData.country}</p>
        <div className='images'>
            
        {spotData && spotData.SpotImages && spotData.SpotImages.length > 0 && (
    <img className='mainImage' src={spotData.SpotImages[0].url} alt={spotData.name} />
)}
            <div className="image-gallery">
                {spotData.SpotImages && spotData.SpotImages.map((image, index) => (
                    <img key={index} src={image.url} alt={`Image ${index + 1}`} />
                ))}
            </div>
        </div>
      <div className="details">
            <div className='info'>
            {spotData.Owner && (<h2> Hosted by {spotData.Owner.firstName} {spotData.Owner.lastName}</h2>)}
            <p>{spotData.description}</p>
            </div>
            <div className='container-price'>
                <div className='container-inner'>
                    <div className='container'>
                    <div className='price'><h3>${spotData.price}</h3> <p>night</p></div>
                    <p className='rating'><FaStar color="#ffc107"/> 
                    {spotData.avgStarRating ? ` ${spotData.avgStarRating}` : ' New'} 
                   {!reviewsIsEmpty && ( spotData.numReviews ? ` · ${spotData.numReviews}` : '· 0' ) }
                    {!reviewsIsEmpty && (spotData.numReviews === 1 ? ' review' : ' reviews')}</p>
                    </div>
                    <button onClick={()=> alert('Feature Coming Soon...')}>Reserve</button>
                </div>
           </div>
        </div>
        <div className='reviews'>
        <h3 className='rating2'>
  <FaStar color="#ffc107"/> 
  {spotData.avgStarRating ? ` ${spotData.avgStarRating}` : ' New'}   
  {!reviewsIsEmpty && ( spotData.numReviews ? ` · ${spotData.numReviews}` : '· 0' ) }
  {!reviewsIsEmpty && (spotData.numReviews === 1 ? ' review' : ' reviews')}
        </h3> 
        {!dontShowButton && !notLogIn && (
          <OpenModalButton
            buttonText="Post Your Review"
            modalComponent={<ReviewFromModal spotId={spotId}  onClose={closeReviewModal} />}
            onButtonClick={openReviewModal}
          />
        )}
       
        <div>


{!reviewsIsEmpty && Object.keys(reviews).map(reviewId => {
    const review = reviews[reviewId];
   
    if (Number(review.spotId) === Number(spotId)) {
        return (
            <div key={reviewId}>
                <h3>{review.User?.firstName || session.user.firstName}</h3>
                <p>{review.updatedAt.split(" ")[0]} </p>
                <StarRating stars={review.stars} />
                <p>{review.review}</p>
                {review.userId === curUserId && (
                    <OpenModalButton
                        buttonText="Delete"
                        modalComponent={<DeleteReviewModal reviewId={review.id} spotId={spotId} />}
                        onButtonClick={() => openDeleteModal(review.id)}
                    />
                )}
            </div>
        );
    } else {
        return null; // If spotId doesn't match, return null to render nothing
    }
})}

        </div>
        {beTheFirst  &&  <h2>Be the first to post a review! </h2> }
        </div>
    
    </div>
);
}

export default SpotDetails;


//         {  !reviewsIsEmpty  && Object.keys(reviews).map(reviewId => {
//           console.log(reviews, 'reviewId 138')
//     const review = reviews[reviewId];
   
//     return (
//         <div key={reviewId}>
//            <h3>{review.User?.firstName || session.user.firstName}</h3>
//             <p>{review.updatedAt.split(" ")[0]} </p>
//             <StarRating stars={review.stars} />
//             <p>{review.review}</p>
//             {review.userId === curUserId && (
//                 <OpenModalButton
//                     buttonText="Delete"
//                     modalComponent={<DeleteReviewModal reviewId={review.id} spotId={spotId} />}
//                     onButtonClick={() => openDeleteModal(review.id)}
//                 />
//             )}
//         </div>
//     );
// })} 
