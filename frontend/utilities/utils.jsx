import { FaStar , FaRegStar} from 'react-icons/fa';

export function calculateStarsAndReviews(reviews, spotId) {
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
  

  export function formatDate(dateString) {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const date = new Date(dateString);
    
    const month = months[date.getMonth()];
    const year = date.getFullYear();
  
    return `${month} ${year}`;
  }


  export function StarRating({ stars }) {
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

