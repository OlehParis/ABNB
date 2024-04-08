import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchSpot } from '../../store/spot';
import './SpotDetails.css';
import { FaStar } from 'react-icons/fa';

function SpotDetails() {
    
    const { spotId } = useParams();
    const dispatch = useDispatch()
    const spotData = useSelector(state => state.spot.data[0]);
   
    useEffect(() => {
        // Fetch spot details when the component mounts or when spotId changes
        dispatch(fetchSpot(spotId));
      }, [dispatch, spotId]);

    if (!spotData) {
        return <div>Loading...</div>;
    }
    
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
                    <p className='rating'><FaStar/> {spotData.avgStarRating ? spotData.avgStarRating : 'New'} · {spotData.numReviews ? spotData.numReviews : '0'} reviews </p>
                    </div>
                    <button onClick={()=> alert('Feature Coming Soon...')}>Reserve</button>
                </div>
           </div>
        </div>
        <div className='reviews'>
        <h3 className='rating2'><FaStar/> {spotData.avgStarRating ? spotData.avgStarRating : 'New'} · {spotData.numReviews ? spotData.numReviews : '0'} reviews </h3>
        <div> </div>
        </div>
    
    </div>
);
}

export default SpotDetails;
