import './SpotDetails.css';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState} from 'react';
import { useParams } from 'react-router-dom';
import './SpotDetails.css';
import { FaStar } from 'react-icons/fa';
import { fetchSpot } from '../../store/spots';
import { useLocation } from 'react-router-dom';
import { fetchBooking} from '../../store/bookings';
import { useNavigate } from 'react-router-dom'


function RequestToBook ()  {
  const navigate = useNavigate();
    const { spotId } = useParams();
    const location = useLocation();
    const { checkIn, checkOut } = location.state;
    const dispatch = useDispatch()
    const spotData = useSelector(state => state.spots[spotId]);
    const [selectedDays, setSelectedDays] = useState(0);
   
    
    useEffect(() => {
      dispatch(fetchSpot(spotId));
    }, [dispatch, spotId]);
    
 
    const reviews = useSelector(state => state.reviews)
    
   
    

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
      const calculateSelectedDays = (checkInDate, checkOutDate) => {
        if (checkInDate && checkOutDate) {
            const millisecondsInADay = 1000 * 60 * 60 * 24;
            const differenceInTime = checkOutDate.getTime() - checkInDate.getTime();
            const differenceInDays = Math.ceil(differenceInTime / millisecondsInADay);
            return differenceInDays;
        }
        return 0;
    };
    useEffect(() => {
        setSelectedDays(calculateSelectedDays(checkIn, checkOut));
    }, [checkIn, checkOut]);
      
      const { avgStars, reviewCount } = calculateStarsAndReviews(reviews, spotId);
       
      const handleReserveClick = () => {
  
        const bookingsPost = { spotId, startDate: checkIn, endDate: checkOut , totalPrice };
        dispatch(fetchBooking(bookingsPost))
          .then(() => {
            
            navigate(`/bookings/manage`);
          })
        //   .catch(error => {
        //     error.json().then(data => {
        //       const errorMessage = data.message;
        //       console.error(errorMessage);
        //       setBeError(errorMessage);
        //     });
        //   });
      };
      if (!spotData ) {
        return <div>Loading...</div>;}
       let totalPrice= (spotData.price*selectedDays+150+(spotData.price*selectedDays*0.07)).toFixed(2)
       
return ( <>

    <h1>Request to book</h1>
    <div className="details">
    <div className='info'>
    {spotData.Owner && (<h2> Hosted by {spotData.Owner.firstName} {spotData.Owner.lastName}</h2>)}

    </div>
    <div className='container-price'>
        <div className='container-inner'>
          
            <div className='container'>
            <p>{spotData.name}</p>
            <p className='rating'><FaStar color="#ffc107"/> 
            {Number(avgStars) ? ` ${avgStars}` : ' New'}   
            {reviewCount !== 0 && ( reviewCount ? ` · ${reviewCount}` : ' · 0' ) }
            {reviewCount !== 0 && (reviewCount === 1 ? ' review' : ' reviews')}</p>
            
            </div>
            <hr />
            <div className='price-cal'>
                <div className='fee-price'>
                     <div>${spotData.price} x {selectedDays} nights</div>
                     <div className='price-total'>
                        ${spotData.price*selectedDays}
                     </div>
                </div>
                <div className='fee-price'>
                    <div>
                    Cleaning Fee
                    </div>
                    <div>
                    $150
                    </div>
                </div>
                <div className='fee-price'>
                    <div>
                    ABNB service Fee
                    </div>
                    <div>
                    $150
                    </div>
                </div>
                <div className='fee-price'>
                <div>
                   Taxes
                </div>
                <div>
                ${(spotData.price*selectedDays*0.07).toFixed(2)}
                </div>
            </div>

            

             </div>
             <hr />
             <div className='fee-price'>
                <div>
                   Total(USD)
                </div>
                <div>
                ${totalPrice}
                </div>
            </div>
           
            <button onClick={handleReserveClick}>Request to book</button>
        </div>
   </div>
</div>
</>
)
}

export default RequestToBook;
