import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchSpot } from '../../store/spots';
import './SpotDetails.css';
import { FaStar , FaRegStar} from 'react-icons/fa';
import OpenModalButton from '../OpenModalButton/OpenModalButton'
import ReviewFromModal from '../ReviewFromModal/ReviewFromModal'
import DeleteReviewModal from '../DeleteReviewModal/DeleteReviewModal';


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
  


    const sortedReviews = Object.keys(reviews).map(reviewId => {
      return reviews[reviewId];
  });
  
  const sortedR = sortedReviews.slice().sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
 
     
   
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
    if ( Number(review.spotId) === Number(spotId) && review.userId === curUserId ) {
        reviewMatchCurUserId = true;
        break; 
    }
  }  

  function formatDate(dateString) {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const date = new Date(dateString);
    
    const month = months[date.getMonth()];
    const year = date.getFullYear();
  
    return `${month} ${year}`;
  }
    
    const dontShowButton = reviewMatchCurUserId || curUserId === spotOwnerId;
    const notLogIn = session.user === null;

    function calculateStarsAndReviews(reviews, spotId) {
      let totalStars = 0;
      let reviewCount = 0;
    
      Object.keys(reviews).forEach(reviewId => {
        const review = reviews[reviewId];
        if (Number(review.spotId) === Number(spotId)) {
          totalStars += review.stars;
          reviewCount++;
        }
      });

      const avgStarss = reviewCount > 0 ? totalStars / reviewCount : 0;
      const avgStars = (Math.round(avgStarss * 10) / 10).toFixed(1);
      
      return {
        avgStars: avgStars,
        reviewCount: reviewCount
      };
    }
    
    const { avgStars, reviewCount } = calculateStarsAndReviews(reviews, spotId);
    
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
                    {Number(avgStars) ? ` ${avgStars}` : ' New'}   
                    {reviewCount !== 0 && ( reviewCount ? ` · ${reviewCount}` : ' · 0' ) }
                    {reviewCount !== 0 && (reviewCount === 1 ? ' review' : ' reviews')}</p>
                    </div>
                    <button onClick={()=> alert('Feature Coming Soon...')}>Reserve</button>
                </div>
           </div>
        </div>
        <div className='reviews'>
        <h3 className='rating2'>
  <FaStar color="#ffc107"/> 
  
  {Number(avgStars) ? ` ${avgStars}` : ' New'}  
  {reviewCount !== 0 && ( reviewCount ? ` · ${reviewCount}` : ' · 0' ) }
  {reviewCount !== 0 && (reviewCount === 1 ? ' review' : ' reviews')}
                                       
        </h3> 
        <div id='postReviewButton'>
        {!reviewMatchCurUserId && curUserId !== spotOwnerId && !notLogIn && (
          <OpenModalButton
            buttonText="Post Your Review" 
            modalComponent={<ReviewFromModal spotId={spotId}   />}
          />
        )}
        </div>
{reviewCount !==0 && sortedR.map(review => {
    if (Number(review.spotId) === Number(spotId)) {
        return (
            <div key={review.id} className='wow'>
                <h3>{review.User?.firstName || session.user.firstName}</h3>
                <p style={{ color: 'gray' }}>{formatDate(review.updatedAt.split(" ")[0])}</p>
                <StarRating stars={review.stars} />
                <p>{review.review}</p>
                {review.userId === curUserId && (
                    <OpenModalButton
                        buttonText="Delete"
                        modalComponent={<DeleteReviewModal reviewId={review.id} />}
                    />
                )}
            </div>
        );
    } else {
        return null;
    }
})}
        
        {reviewCount == 0 && !notLogIn && !dontShowButton &&  <h2>Be the first to post a review! </h2> }
        </div>
    
    </div>
);
}

export default SpotDetails;
