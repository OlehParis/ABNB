import { useSelector } from 'react-redux';
import { useState } from 'react'; 
import { useNavigate } from 'react-router-dom'
import './Spots.css';
import { FaStar } from 'react-icons/fa';
// import OpenModalButton from '../OpenModalButton/OpenModalButton'


function ManageSpots() {

    const navigate = useNavigate();
    const spotsData = useSelector(state => state.spots.Spots);
    const session = useSelector(state => state.session)
    const curUserId = session.user?.id ?? null;
  


    const handleClick = (id) => {
        navigate(`/spots/${id}`); 
      };
    const handleUpdate = (id) => {
        navigate(`/spots/${id}/edit`)
    }

    

   if(spotsData){
    return (
       <div className='spots-container'> 
           <h1> Manage Your Spots</h1>
          {spotsData.length === 0 && <button onClick={()=> navigate('/spots/new')} >Create New Spot</button>}
        <div className="spot-card" >
        {spotsData.map(spot => (
            spot.ownerId === curUserId &&
            <div key={spot.id} className="spot">
                <div className="tooltip" onClick={() => handleClick(spot.id)} >
                <span className="tooltiptext">{spot.name}</span>
                    <img  className='spot-img'  src={spot.previewImage} alt={spot.name} />
                    <div className='addressAvgRating'>
                    <p>{spot.city}, {spot.state}</p>
                    <p><FaStar color="#ffc107"/> {spot.avgRating ? spot.avgRating : 'New'}</p>
                    </div>
                    <div>${spot.price} night</div>
              
       
                </div>
                    <div className='buttons'> 
                <button onClick={()=> handleUpdate(spot.id)}> Update </button>
                 <button>Delete</button>
               </div>
                   
            </div>
            
        ))}  
    </div>
    
    </div>
    );
}
}

export default ManageSpots;
