import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom'
import './Spots.css';
import { FaStar } from 'react-icons/fa';

function SpotCard() {

    const navigate = useNavigate();
    const spotsData = useSelector(state => state.spots.data.Spots);
 
    const handleClick = (id) => {
        navigate(`/spots/${id}`); 
      };
    
   if(spotsData){

    return (
        <div className="spot-card" >
        {spotsData.map(spot => (
            <div key={spot.id} className="spot">
                <div className="tooltip">
                <span className="tooltiptext">{spot.name}</span>
                    <img  className='spot-img'  onClick={() => handleClick(spot.id)} src={spot.previewImage} alt={spot.name} />
                    <div className='addressAvgRating'>
                    <p>{spot.address}  {spot.state}</p>
                    <p><FaStar color="#ffc107"/> {spot.avgRating ? spot.avgRating : 'New'}</p>
                    </div>
                    
                    <div>${spot.price} night</div>
                  
                  
               
                </div>
            </div>
        ))}  
    </div>
    );}
}

export default SpotCard;
