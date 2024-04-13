import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
// import {useModal} from '../../context/Modal'
import { useParams } from 'react-router-dom';
import { fetchSpot } from '../../store/spots';
import './SpotDetails.css';
import { FaStar , FaRegStar} from 'react-icons/fa';
import OpenModalButton from '../OpenModalButton/OpenModalButton'
// import ReviewFromModal from '../ReviewFromModal/ReviewFromModal'


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
    const spotData = useSelector(state => state.spots.Spots[spotId-1]);
    const session = useSelector(state => state.session)


    const omodal = () => {
   return (<OpenModalButton
      buttonText ='Hello'
      modalComponent = {<h2>hello</h2>}
    />)
  };


    useEffect(() => {
        dispatch(fetchSpot(spotId));
      }, [dispatch, spotId]);

    if (!spotData) {
        return <div>Loading...</div>;
    }
    if (!spotData.reviews) {
      return <div>Loading...</div>;
  }
    const reviews = spotData.reviews.Reviews
    const curUserId = session.user?.id ?? null;
    const spotOwnerId = spotData.ownerId
    const reviewMatchCurUserId = reviews.some(review => review.ownerId === curUserId);
   
    return (
        <div className="spot-details">
        <h2>{spotData.name}</h2>
        <p>{spotData.address}, {spotData.state},  {spotData.country}</p>
        <div className='images'>
            
            <img className='mainImage' src={spotData.SpotImages[0].url} alt={spotData.name} />
            <div className="image-gallery">
                {spotData.SpotImages.map((image, index) => (
                    <img key={index} src={image.url} alt={`Image ${index + 1}`} />
                ))}
            </div>
        </div>
        <div className="details">
            <div className='info'>
            <h2> Hosted by {spotData.Owner.firstName} {spotData.Owner.lastName}</h2>
            <p>{spotData.description}</p>
            </div>
            <div className='container-price'>
                <div className='container-inner'>
                    <div className='container'>
                    <div className='price'><h3>${spotData.price}</h3> <p>night</p></div>
                    <p className='rating'><FaStar color="#ffc107"/> 
                    {spotData.avgStarRating ? spotData.avgStarRating : ' New'} · 
                    {spotData.numReviews ? spotData.numReviews : ' 0'} 
                    {spotData.numReviews === 1 ? ' review' : ' reviews'} </p>
                    </div>
                    <button onClick={()=> alert('Feature Coming Soon...')}>Reserve</button>
                </div>
           </div>
        </div>
        <div className='reviews'>
        <h3 className='rating2'>
  <FaStar/> 
  {spotData.avgStarRating ? spotData.avgStarRating : 'New'}  · 
  {spotData.numReviews ? spotData.numReviews : ' 0'} 
  {spotData.numReviews === 1 ? ' review' : ' reviews'}
</h3>
{reviewMatchCurUserId && curUserId === spotOwnerId ? "" : <button onClick= {omodal} >Post Your Review</button>}

        <div>
        {reviews.map((review, index) => (
          <div   key={index} >
                <h3>{review.User.firstName}</h3>
                <p>{review.updatedAt.split(" ")[0]} </p>
                <StarRating stars={review.stars} />
                <p>{review.review}</p>
            </div> ))}
        </div>
        </div>
    
    </div>
);
}

export default SpotDetails;
