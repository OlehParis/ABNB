import { useSelector } from 'react-redux';
import './Spots.css';

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
                    <p>{spot.name}</p>  
                    <img src={spot.previewImage} alt={spot.name} />
                    <p>${spot.price} per night</p>
                    <p>{spot.address}  {spot.state}</p>
                  
                    <span className="tooltiptext">{spot.name}</span>
                </div>
            </div>
        ))}  
    </div>
    );}
}

export default SpotCard;
