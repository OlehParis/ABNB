import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';

import { useParams } from 'react-router-dom';
import { fetchSpot } from '../../store/spot';
import './SpotDetails.css';
import { FaStar , FaRegStar} from 'react-icons/fa';



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
    const data = useSelector(state => state.spot.data);
    const spotData = data[0]
    
    
//  console.log(reviews[0].User.firstName)
    useEffect(() => {
        dispatch(fetchSpot(spotId));
      }, [dispatch, spotId]);

    if (!spotData) {
        return <div>Loading...</div>;
    }
    const reviews = data.reviews.Reviews
   

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
