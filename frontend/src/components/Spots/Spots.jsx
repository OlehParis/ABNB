import { useSelector } from 'react-redux';
import './Spots.css';
import { FaStar } from 'react-icons/fa';

function SpotCard() {
    // Accessing spot data from Redux state
    const spotsData = useSelector(state => state.spots.data.Spots);
    console.log(spotsData)
    
   if(spotsData){

    return (
        <div className="spot-card">
        {spotsData.map(spot => (
            <div key={spot.id} className="spot">
                <div className="tooltip">
                <span className="tooltiptext">{spot.name}</span>
                    <img  className='spot-img'src={spot.previewImage} alt={spot.name} />
                    <div className='addressAvgRating'>
                    <p>{spot.address}  {spot.state}</p>
                    <p><FaStar/> {spot.avgRating ? spot.avgRating : 'New'}</p>
                    </div>
                    
                    <div>${spot.price} night</div>
                  
                  
               
                </div>
            </div>
        ))}  
    </div>
    );}
}

export default SpotCard;
