
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
  