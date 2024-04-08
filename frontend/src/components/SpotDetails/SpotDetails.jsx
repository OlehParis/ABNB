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
    console.log(spotData)
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
            <div className='container1'>
            <img className='mainImage' src={spotData.SpotImages[0].url} alt={spotData.name} />
            </div>
            <div className="image-gallery">
                {spotData.SpotImages.map((image, index) => (
                    <img key={index} src={image.url} alt={`Image ${index + 1}`} />
                ))}
            </div>
        </div>
        <div className="details">
            <h2> Hosted by {spotData.Owner.firstName} {spotData.Owner.lastName}</h2>
            <p>{spotData.description}</p>
            <p><FaStar/> {spotData.avgRating ? spotData.avgRating : 'New'}</p>
            <p>${spotData.price} night</p>
        </div>
    </div>
);
}

export default SpotDetails;
